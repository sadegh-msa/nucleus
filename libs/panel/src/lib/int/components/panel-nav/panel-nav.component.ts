import { NgClass, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { getFadeDelayEnterAnimation, MenuItemsComponent } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';
import { NuPanelService } from '../../../ext';

@Component({
  selector: 'nav[nu-panel-nav]',
  imports: [SvgIconComponent, NgClass, NgOptimizedImage, MenuItemsComponent, NgTemplateOutlet],
  animations: [getFadeDelayEnterAnimation()],
  templateUrl: './panel-nav.component.html',
  styleUrl: './panel-nav.component.scss',
})
export class NuPanelNavComponent {
  readonly #panelService = inject(NuPanelService);
  readonly #nuCommonConfig = inject(NU_COMMON_CONFIG);

  readonly branding = this.#nuCommonConfig.branding;
  readonly navMode = this.#panelService.navMode;
  readonly mainMenu = this.#panelService.mainMenu;
  readonly footerMenu = this.#panelService.footerMenu;

  toggleNavMode() {
    this.#panelService.toggleNavMode();
  }
}
