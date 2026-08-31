import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { NuPanelHeader, NuPanelNav } from '../../../int/components';
import { PanelProgressbar } from '../../../int/services';
import { PanelManager } from '../../services/panel-manager';

@Component({
  selector: 'nu-panel',
  imports: [NuPanelHeader, NuPanelNav],
  host: {
    '[class]': 'styleClass()',
  },
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Panel {
  readonly #panelManager = inject(PanelManager);
  readonly #progressbar = inject(PanelProgressbar);

  readonly navExtent = this.#panelManager.navExtent;
  readonly isNavVisible = this.#panelManager.isNavVisible;
  readonly progressValue = this.#progressbar.value;

  readonly styleClass = computed(() => `nu nav-${this.navExtent()}`);
}
