import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { type Extent, extents, PermanentStorageService } from '@nucleus/common';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  readonly #permanentStorageService = inject(PermanentStorageService);

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
    this.#permanentStorageService.setItem(this.#STORAGE_NAV_KEY, this.navExtent());
  }

  #restoreExtent() {
    let extent = this.#permanentStorageService.getItem<Extent>(this.#STORAGE_NAV_KEY);

    if (!extents?.includes(extent)) {
      extent = 'wide' as Extent;
    }

    this.navExtent.set(extent);
  }

  toggleNavExtent() {
    this.navExtent.set(this.navExtent() === 'compact' ? 'wide' : 'compact');
  }
}
