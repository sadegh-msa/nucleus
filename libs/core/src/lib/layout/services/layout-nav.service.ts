import { effect, Injectable, signal } from '@angular/core';
import { LayoutNavMode } from '../enums/layout.enum';

@Injectable({
  providedIn: 'root'
})
export class LayoutNavService {
  readonly mode = signal<LayoutNavMode>(LayoutNavMode.Wide);
  readonly storeModeKey = 'layout.nav.mode';

  constructor() {
    this.#restoreMode();

    effect(() => {
      this.#storeMode(this.mode());
    });
  }

  #storeMode(mode: LayoutNavMode) {
    localStorage.setItem(this.storeModeKey, mode);
  }

  #restoreMode() {
    const restoredMode = localStorage.getItem(this.storeModeKey);
    this.mode.set((restoredMode || LayoutNavMode.Wide) as LayoutNavMode);
  }
}
