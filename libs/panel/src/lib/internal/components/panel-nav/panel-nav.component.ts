import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getFadeDelayEnterAnimation, MenuItemsComponent } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';
import { NuPanelService } from '../../../external';

@Component({
    selector: 'nav[nu-panel-nav]',
    imports: [RouterLink, SvgIconComponent, NgClass, NgOptimizedImage, MenuItemsComponent],
    animations: [getFadeDelayEnterAnimation()],
    templateUrl: './panel-nav.component.html',
    styleUrl: './panel-nav.component.scss'
})
export class NuPanelNavComponent {
  readonly #panelService = inject(NuPanelService);

  readonly navMode = this.#panelService.navMode;
  readonly mainMenu = this.#panelService.mainMenu;
  readonly footerMenu = this.#panelService.footerMenu;

  toggleNavMode() {
    this.#panelService.toggleNavMode();
  }
}
