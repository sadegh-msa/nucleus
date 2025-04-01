import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { createFadeAnimation, OperationStatus } from '@nucleus/common';
import { authActions, authSelectors } from '@nucleus/core';
import { MenuItem } from '@nucleus/fabric';
import { NuPanelService } from '@nucleus/panel';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { SampleEventHandlerService } from './pages/sample';
import { AppStates } from './store/app.state';

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
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ConfirmationService],
  animations: [createFadeAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #appStore$ = inject(Store<AppStates>);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #sampleEventHandlerService = inject(SampleEventHandlerService);
  readonly #panelService = inject(NuPanelService);

  readonly isUserAuthenticated = signal(false);
  readonly showLoading = signal(false);
  readonly htmlDir = signal<'ltr' | 'rtl'>('ltr');

  constructor() {
    effect(() => {
      document.dir = this.htmlDir();
    });
  }

  ngOnInit() {
    this.#handleEvents();
    this.#panelService.footerMenu.set([
      {
        id: 'nucleus-menu-sign-out',
        label: $localize`Sign out`,
        icon: 'icons/outline/logout.svg',
        iconNgClass: 'outline',
        command: () => this.confirmSignOut(),
        permission: 'nucleus.menu.button.sign-out',
      },
    ] as MenuItem[]);
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
