import { computed, effect, inject, Service, signal } from '@angular/core';
import { type ExtentType, extents, PermanentStorage } from '@nucleus/common';
import { panelInternalConfig } from '../../int/configs';

const navConfig = panelInternalConfig.nav;

@Service()
export class PanelManager {
  readonly #permanentStorage = inject(PermanentStorage);

  readonly navExtent = signal<ExtentType>('wide');
  readonly isNavCompact = computed(() => this.navExtent() === 'compact');
  readonly isNavWide = computed(() => this.navExtent() === 'wide');
  readonly isNavVisible = signal(true);

  constructor() {
    this.#restoreExtent();

    effect(() => {
      this.#storeExtent();
    });
  }

  #storeExtent() {
    this.#permanentStorage.setItem(navConfig.storageKey, this.navExtent());
  }

  #restoreExtent() {
    let extent = this.#permanentStorage.getItem<ExtentType>(navConfig.storageKey);

    if (!extents.includes(extent)) {
      extent = 'wide' as ExtentType;
    }

    this.navExtent.set(extent);
  }

  toggleNavExtent() {
    this.navExtent.set(this.navExtent() === 'compact' ? 'wide' : 'compact');
  }
}
