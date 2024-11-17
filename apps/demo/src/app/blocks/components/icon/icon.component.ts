import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly iconFamilies = [
    'bold',
    'broken',
    'bulk',
    'linear',
    'outline',
    'twotone',
  ];
}
