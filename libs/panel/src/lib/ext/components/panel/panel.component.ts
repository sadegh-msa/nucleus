import { Component, inject, ViewEncapsulation } from '@angular/core';
import { NuPanelHeaderComponent, NuPanelNavComponent, PanelProgressbar } from '../../../int';
import { PanelManager } from '../../services/panel-manager';

@Component({
  selector: 'nu-panel',
  imports: [NuPanelHeaderComponent, NuPanelNavComponent],
  host: {
    '[class]': 'styleClass',
  },
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PanelComponent {
  readonly #panelManager = inject(PanelManager);
  readonly #progressbar = inject(PanelProgressbar);

  readonly navExtent = this.#panelManager.navExtent;
  readonly isNavVisible = this.#panelManager.isNavVisible;
  readonly progressValue = this.#progressbar.value;

  get styleClass() {
    return `nu nav-${this.navExtent()}`;
  }
}
