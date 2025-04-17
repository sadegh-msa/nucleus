import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NuPanelHeaderComponent, NuPanelNavComponent } from '../../../int';
import { PanelProgressbarService } from '../../../int/services';
import { NuPanelService } from '../../services/panel.service';

@Component({
  selector: 'nu-panel',
  imports: [RouterOutlet, NuPanelHeaderComponent, NuPanelNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NuPanelComponent {
  readonly #panelService = inject(NuPanelService);
  readonly #progressbarService = inject(PanelProgressbarService);

  readonly navMode = this.#panelService.navMode;
  readonly progressValue = this.#progressbarService.value;

  @HostBinding('class')
  get styleClass() {
    return `nu nav-${this.navMode()}`;
  }
}
