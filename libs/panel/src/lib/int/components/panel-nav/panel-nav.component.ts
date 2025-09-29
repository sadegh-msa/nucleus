import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import {
  RippleDirective,
  ScreenService,
  SvgIconDirective
} from '@nucleus/fabric';
import { PanelService } from '../../../ext';

@Component({
  selector: 'nav[nu-panel-nav]',
  imports: [NgOptimizedImage, RippleDirective, NgClass, SvgIconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-nav.component.html',
  styleUrl: './panel-nav.component.scss',
})
export class NuPanelNavComponent {
  readonly #screenService = inject(ScreenService);
  readonly #panelService = inject(PanelService);
  readonly #nuCommonConfig = inject(NU_COMMON_CONFIG);

  readonly branding = this.#nuCommonConfig.branding.organization;

  readonly breakpoints = this.#screenService.breakpoints;
  readonly navExtent = this.#panelService.navExtent;
  readonly isNavWide = this.#panelService.isNavWide;
  readonly isNavCompact = this.#panelService.isNavCompact;

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
    this.#panelService.toggleNavExtent();
  }
}
