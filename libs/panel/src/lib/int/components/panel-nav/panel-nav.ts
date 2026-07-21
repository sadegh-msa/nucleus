import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import { UiScreenUtils, UiSvgIcon } from '@nucleus/ui';
import { PanelManager } from '../../../ext/services/panel-manager'; // Possibility of circular dependency

@Component({
  selector: 'nav[nu-panel-nav]',
  imports: [NgOptimizedImage, NgClass, UiSvgIcon],
  templateUrl: './panel-nav.html',
  styleUrl: './panel-nav.scss',
})
export class NuPanelNav {
  readonly #uiScreenUtils = inject(UiScreenUtils);
  readonly #panelManager = inject(PanelManager);

  readonly branding = injectNuCommonConfig().branding.organization;

  readonly breakpoints = this.#uiScreenUtils.breakpoints;
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
