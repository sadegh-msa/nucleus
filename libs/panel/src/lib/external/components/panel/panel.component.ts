import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NuPanelHeaderComponent, NuPanelNavComponent } from '../../../internal';
import { NuPanelService } from '../../services';

@Component({
    selector: 'nu-panel',
    imports: [RouterOutlet, NuPanelHeaderComponent, NuPanelNavComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './panel.component.html',
    styleUrl: './panel.component.scss'
})
export class NuPanelComponent {
  readonly #panelService = inject(NuPanelService);

  readonly navMode = this.#panelService.navMode;

  @HostBinding('class')
  get styleClass() {
    return `nu nav-${this.navMode()}`;
  }
}
