import { Injectable, signal } from '@angular/core';
import { MenuItem } from '@fabric/ui';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  readonly navMode = signal<'compact' | 'wide'>('wide');
  readonly mainMenu = signal<MenuItem[]>([]);
  readonly footerMenu = signal<MenuItem[]>([]);

  toggleNavMode() {
    this.navMode.update((v) => (v === 'wide' ? 'compact' : 'wide'));
  }
}
