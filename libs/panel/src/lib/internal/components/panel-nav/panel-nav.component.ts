import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { getFadeDelayEnterAnimation, MenuItemsComponent } from '@fabric/ui';
import { SvgIconComponent } from 'angular-svg-icon';
import { PanelService } from '../../../external';

@Component({
  selector: 'nav[panel-nav]',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SvgIconComponent,
    NgClass,
    NgOptimizedImage,
    MenuItemsComponent,
  ],
  animations: [getFadeDelayEnterAnimation()],
  templateUrl: './panel-nav.component.html',
  styleUrl: './panel-nav.component.scss',
})
export class PanelNavComponent {
  readonly #panelService = inject(PanelService);

  readonly navMode = this.#panelService.navMode;
  readonly mainMenu = this.#panelService.mainMenu;
  readonly footerMenu = this.#panelService.footerMenu;

  toggleNavMode() {
    this.#panelService.toggleNavMode();
  }
}
