import { computed, effect, inject, Service, signal } from '@angular/core';
import { type Extent, extents, PermanentStorage } from '@nucleus/common';

@Service()
export class PanelManager {
  readonly #permanentStorage = inject(PermanentStorage);

  readonly #STORAGE_NAV_KEY = 'panelNavExtent';

  readonly navExtent = signal<Extent>('wide');
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
    this.#permanentStorage.setItem(this.#STORAGE_NAV_KEY, this.navExtent());
  }

  #restoreExtent() {
    let extent = this.#permanentStorage.getItem<Extent>(this.#STORAGE_NAV_KEY);

    if (!extents.includes(extent)) {
      extent = 'wide' as Extent;
    }

    this.navExtent.set(extent);
  }

  toggleNavExtent() {
    this.navExtent.set(this.navExtent() === 'compact' ? 'wide' : 'compact');
  }
}
