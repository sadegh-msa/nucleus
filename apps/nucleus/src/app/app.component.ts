import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import { authActions, authSelectors } from '@nucleus/core';
import {
  type MenuItem,
  MenuItemsComponent,
  MessageComponent,
  MessageService,
} from '@nucleus/fabric';
import { type NuLangDir, NuLocaleService } from '@nucleus/l10n';
import { PanelService } from '@nucleus/panel';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelComponent } from '../../../../libs/panel/src/lib/ext/components';
import { navMainMenu } from './app.menu';
import { SampleEventHandlerService } from './pages/crud/sample';
import type { AppStates } from './store/app.state';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    MessageComponent,
    NgTemplateOutlet,
    MenuItemsComponent,
    NgClass,
    PanelComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #appStore$ = inject(Store<AppStates>);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #sampleEventHandlerService = inject(SampleEventHandlerService);
  readonly #panelService = inject(PanelService);
  readonly #localeService = inject(NuLocaleService);
  readonly #messageService = inject(MessageService);

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

      untracked(() => {
        this.#localeService.setDir(dir);

        this.#messageService.add({
          variant: 'info',
          title: 'Direction',
          content: dir.toUpperCase()
        });
      });
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
