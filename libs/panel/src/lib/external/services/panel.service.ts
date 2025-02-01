import { Injectable, signal } from '@angular/core';
import { MenuItem } from '@nucleus/fabric';

@Injectable({
  providedIn: 'root',
})
export class NuPanelService {
  readonly navMode = signal<'compact' | 'wide'>('wide');
  readonly mainMenu = signal<MenuItem[]>([]);
  readonly footerMenu = signal<MenuItem[]>([]);

  toggleNavMode() {
    this.navMode.update((v) => (v === 'wide' ? 'compact' : 'wide'));
  }
}
