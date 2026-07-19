import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import { ScreenUtils, SvgIconDirective } from '@nucleus/ui';
import { PanelManager } from '../../../ext/services/panel-manager'; // Possibility of circular dependency

@Component({
  selector: 'nav[nu-panel-nav]',
  imports: [NgOptimizedImage, NgClass, SvgIconDirective],
  templateUrl: './panel-nav.component.html',
  styleUrl: './panel-nav.component.scss',
})
export class NuPanelNavComponent {
  readonly #screenUtils = inject(ScreenUtils);
  readonly #panelManager = inject(PanelManager);

  readonly branding = injectNuCommonConfig().branding.organization;

  readonly breakpoints = this.#screenUtils.breakpoints;
  readonly navExtent = this.#panelManager.navExtent;
  readonly isNavWide = this.#panelManager.isNavWide;
  readonly isNavCompact = this.#panelManager.isNavCompact;

  readonly logoInfo = computed(() => {
    const { logo, title } = this.branding;
    const isNavWide = this.isNavWide();

    return {
      alt: title,
      height: isNavWide ? logo.hTitle.height : logo.noTitle.height,
      width: isNavWide ? logo.hTitle.width : logo.noTitle.width,
      src: isNavWide ? logo.hTitle.path : logo.noTitle.path,
    };
  });

  toggleNavMode() {
    this.#panelManager.toggleNavExtent();
  }
}
