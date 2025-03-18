import { NgOptimizedImage, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Menu } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenu } from 'primeng/panelmenu';
import { Tooltip } from 'primeng/tooltip';
import { createFadeAnimation } from '../../../common';
import { LayoutNavMode } from '../../enums/layout.enum';
import { SCR_LAYOUT_CONFIG } from '../../providers/layout-config.provider';
import { LayoutNavService } from '../../services/layout-nav.service';

@Component({
  selector: 'scr-layout-nav',
  templateUrl: './layout-nav.component.html',
  animations: [createFadeAnimation()],
  imports: [
    Card,
    PrimeTemplate,
    Divider,
    Button,
    PanelMenu,
    Tooltip,
    Menu,
    OverlayPanelModule,
    NgOptimizedImage,
    NgStyle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutNavComponent {
  readonly #layoutConfig = inject(SCR_LAYOUT_CONFIG);
  readonly #navService = inject(LayoutNavService);

  readonly mode = this.#navService.mode.asReadonly();
  readonly LayoutNavMode = LayoutNavMode;
  readonly branding = this.#layoutConfig.branding;
  readonly navMenuItems = this.#layoutConfig.navMenuItems;

  toggleNavMode() {
    const { Wide, Compact } = LayoutNavMode;
    this.#navService.mode.set(this.mode() === Wide ? Compact : Wide);
  }
}
