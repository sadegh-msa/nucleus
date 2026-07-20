import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OperationStatus } from '@nucleus/common';
import { injectAuthStore } from '@nucleus/core/auth';
import { LocaleUtils, type NuLangDir } from '@nucleus/l10n';
import { Panel, PanelManager } from '@nucleus/panel';
import {
  type MenuItemModel,
  MenuItems,
  Message,
  MessageManager,
} from '@nucleus/ui';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { navMainMenu } from './app.menu';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    Message,
    NgTemplateOutlet,
    MenuItems,
    NgClass,
    Panel,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  providers: [ConfirmationService],
})
export class App {
  readonly #authStore = injectAuthStore();
  readonly #confirmationService = inject(ConfirmationService);
  readonly #panelManager = inject(PanelManager);
  readonly #localeUtils = inject(LocaleUtils);
  readonly #messageManager = inject(MessageManager);

  readonly navMainMenu = navMainMenu;
  readonly navFooterMenu = [
    {
      id: 'nucleus-menu-sign-out',
      label: $localize`Sign out`,
      icon: 'logout',
      command: () => this.confirmSignOut(),
      permission: 'nucleus.menu.button.sign-out',
    },
  ] as MenuItemModel[];

  readonly isUserAuthenticated = signal(false);
  readonly showLoading = signal(false);
  readonly htmlDir = signal<NuLangDir>('ltr');
  readonly navExtent = this.#panelManager.navExtent;

  constructor() {
    this.#handleEvents();

    effect(() => {
      const dir = this.htmlDir();

      untracked(() => {
        this.#localeUtils.setDir(dir);

        this.#messageManager.add({
          variant: 'info',
          title: 'Direction',
          content: dir.toUpperCase(),
        });
      });
    });
  }

  #handleEvents() {
    effect(() => {
      const status = this.#authStore.checkStatus();
      if (status === OperationStatus.Success) {
        this.isUserAuthenticated.set(true);
      } else if (status === OperationStatus.Failure) {
        this.isUserAuthenticated.set(false);
      }
    });

    effect(() => {
      const status = this.#authStore.signOutStatus();
      this.showLoading.set(status === OperationStatus.InProgress);
    });
  }

  signOut() {
    this.#authStore.signOut();
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
