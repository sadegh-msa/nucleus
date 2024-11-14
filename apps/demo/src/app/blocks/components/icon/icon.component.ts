import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { colors } from '../../shared/data/colors';
import { sizes } from '../../shared/data/sizes';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [SvgIconComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly iconFamilies = [
    'bold',
    'broken',
    'bulk',
    'linear',
    'outline',
    'twotone',
  ];
  readonly colors = colors;
  readonly sizes = sizes;
}
