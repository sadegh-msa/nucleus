import { computed, effect, inject, Service, signal, untracked } from '@angular/core';
import { PermanentStorage } from '@nucleus/common';
import { type ExtentType, extentLiterals } from '@nucleus/ui';
import { panelInternalConfig } from '../../int/configs';

const navConfig = panelInternalConfig.nav;

@Service()
export class PanelManager {
  readonly #permanentStorage = inject(PermanentStorage);

  readonly navExtent = signal<ExtentType>(this.#restoreExtent());
  readonly isNavCompact = computed(() => this.navExtent() === 'compact');
  readonly isNavWide = computed(() => this.navExtent() === 'wide');
  readonly isNavVisible = signal(true);

  constructor() {
    effect(() => {
      const extent = this.navExtent();
      untracked(() => this.#storeExtent(extent));
    });
  }

  #storeExtent(extent: ExtentType) {
    this.#permanentStorage.setItem(navConfig.storageKey, extent);
  }

  #restoreExtent(): ExtentType {
    const extent = this.#permanentStorage.getItem<ExtentType>(navConfig.storageKey);

    return extentLiterals.includes(extent) ? extent : 'wide';
  }

  toggleNavExtent() {
    this.navExtent.set(this.navExtent() === 'compact' ? 'wide' : 'compact');
  }
}
