import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanelHeaderComponent, PanelNavComponent } from '../../../internal';
import { PanelService } from '../../services';

@Component({
  selector: 'panel-main',
  standalone: true,
  imports: [RouterOutlet, PanelHeaderComponent, PanelNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-main.component.html',
  styleUrl: './panel-main.component.scss',
})
export class PanelMainComponent {
  readonly #panelService = inject(PanelService);

  readonly navMode = this.#panelService.navMode;

  @HostBinding('class')
  get styleClass() {
    return `nav-${this.navMode()}`;
  }
}
