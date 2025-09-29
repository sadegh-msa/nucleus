import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation
} from '@angular/core';
import { NuPanelHeaderComponent, NuPanelNavComponent, PanelProgressbarService } from '../../../int';
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'nu-panel',
  imports: [NuPanelHeaderComponent, NuPanelNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'styleClass',
  },
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PanelComponent {
  readonly #panelService = inject(PanelService);
  readonly #progressbarService = inject(PanelProgressbarService);

  readonly navExtent = this.#panelService.navExtent;
  readonly isNavVisible = this.#panelService.isNavVisible;
  readonly progressValue = this.#progressbarService.value;

  get styleClass() {
    return `nu nav-${this.navExtent()}`;
  }
}
