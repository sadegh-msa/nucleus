import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { injectAuthStore } from '@nucleus/auth';
import { type LangDirType, LocaleUtil } from '@nucleus/l10n';
import { Panel, PanelManager } from '@nucleus/panel';
import {
  UiDialog,
  UiMenu,
  type UiMenuItemModel,
  UiMessage,
  UiMessageManager,
  UiSvgIcon,
} from '@nucleus/ui';
import { navMainMenu } from './app.menu';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    UiMessage,
    NgTemplateOutlet,
    UiMenu,
    NgClass,
    Panel,
    UiSvgIcon,
    UiDialog,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  readonly #authStore = injectAuthStore();
  readonly #panelManager = inject(PanelManager);
  readonly #localeUtil = inject(LocaleUtil);
  readonly #uiMessageManager = inject(UiMessageManager);

  readonly navMainMenu = structuredClone(navMainMenu) as UiMenuItemModel[];
  readonly navFooterMenu = [
    {
      id: 'nucleus-menu-sign-out',
      label: $localize`Sign out`,
      icon: 'logout',
      command: () => this.showSignOutConfirm.set(true),
      permission: 'nucleus.menu.button.sign-out',
    },
  ] as UiMenuItemModel[];
  readonly navExtent = this.#panelManager.navExtent;

  readonly htmlDir = signal<LangDirType>('ltr');
  readonly showSignOutConfirm = signal(false);

  readonly isUserAuthenticated = computed(() => this.#authStore.checkStatus() === 'success');
  readonly showLoading = computed(() => this.#authStore.signOutStatus() === 'inProgress');

  constructor() {
    this.#handleEvents();
  }

  #handleEvents() {
    effect(() => {
      const dir = this.htmlDir();

      untracked(() => {
        this.#localeUtil.setDir(dir);

        this.#uiMessageManager.add({
          variant: 'info',
          title: 'Direction',
          content: dir.toUpperCase(),
        });
      });
    });
  }

  signOut() {
    this.#authStore.signOut();
    this.showSignOutConfirm.set(false);
  }
}
