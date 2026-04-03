import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { iconVariants, SvgIconDirective } from '@nucleus/fabric';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-icon',
  imports: [SvgIconDirective, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = iconVariants;
}
