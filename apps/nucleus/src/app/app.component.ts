import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { createFadeAnimation, OperationStatus } from '@nucleus/common';
import { authActions, authSelectors } from '@nucleus/core';
import { type MenuItem, MenuItemsComponent, MessageComponent } from '@nucleus/fabric';
import { type NuLangDir, NuLocaleService } from '@nucleus/l10n';
import { PanelService } from '@nucleus/panel';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { PanelComponent } from '../../../../libs/panel/src/lib/ext/components';
import { navMainMenu } from './app.menu';
import { SampleEventHandlerService } from './pages/sample';
import type { AppStates } from './store/app.state';

@Component({
  imports: [
    RouterModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    DropdownModule,
    FormsModule,
    BadgeModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    MessageComponent,
    NgTemplateOutlet,
    MenuItemsComponent,
    NgClass,
    PanelComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ConfirmationService],
  animations: [createFadeAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appStore$ = inject(Store<AppStates>);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #sampleEventHandlerService = inject(SampleEventHandlerService);
  readonly #panelService = inject(PanelService);
  readonly #localeService = inject(NuLocaleService);

  readonly navMainMenu = navMainMenu;
  readonly navFooterMenu = [
    {
      id: 'nucleus-menu-sign-out',
      label: $localize`Sign out`,
      icon: 'logout',
      command: () => this.confirmSignOut(),
      permission: 'nucleus.menu.button.sign-out',
    },
  ] as MenuItem[];

  readonly isUserAuthenticated = signal(false);
  readonly showLoading = signal(false);
  readonly htmlDir = signal<NuLangDir>('ltr');
  readonly navExtent = this.#panelService.navExtent;

  constructor() {
    this.#handleEvents();

    effect(() => {
      const dir = this.htmlDir();

      untracked(() => this.#localeService.setDir(dir));
    });
  }

  #handleEvents() {
    this.#appStore$.pipe(select(authSelectors.check.status)).subscribe((status) => {
      if (status === OperationStatus.Success) {
        this.isUserAuthenticated.set(true);
      } else if (status === OperationStatus.Failure) {
        this.isUserAuthenticated.set(false);
      }
    });

    this.#appStore$.pipe(select(authSelectors.signOut.status)).subscribe((status) => {
      this.showLoading.set(status === OperationStatus.InProgress);
    });

    this.#sampleEventHandlerService.register();
  }

  signOut() {
    this.#appStore$.dispatch(authActions.signOut());
  }

  confirmSignOut() {
    this.#confirmationService.confirm({
      message: 'Are You sure you want to logout?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.signOut(),
    });
  }
}
