import { effect, inject, Injectable, signal } from '@angular/core';
import { MenuItem } from '@nucleus/fabric';
import { type PanelNavMode } from '../unions/panel.union';
import { NU_PANEL_CONFIG } from '../../int/providers/panel-config.provider';

@Injectable({
  providedIn: 'root',
})
export class NuPanelService {
  readonly #nuPanelConfig = inject(NU_PANEL_CONFIG);
  readonly navMode = signal<PanelNavMode>('wide');
  readonly mainMenu = signal<MenuItem[]>(this.#nuPanelConfig.nav.mainMenu || []);
  readonly footerMenu = signal<MenuItem[]>(this.#nuPanelConfig.nav.footerMenu || []);
  readonly storeModeKey = 'panel.nav.mode';

  constructor() {
    this.#restoreMode();

    effect(() => {
      this.#storeMode(this.navMode());
    });
  }

  #storeMode(mode: PanelNavMode) {
    localStorage.setItem(this.storeModeKey, mode);
  }

  #restoreMode() {
    const restoredMode = localStorage.getItem(this.storeModeKey);
    this.navMode.set((restoredMode || 'wide') as PanelNavMode);
  }

  toggleNavMode() {
    this.navMode.update((v) => (v === 'wide' ? 'compact' : 'wide'));
  }
}
