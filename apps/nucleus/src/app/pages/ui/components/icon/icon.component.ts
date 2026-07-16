import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { iconVariants, SvgIconDirective } from '@nucleus/ui';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-icon',
  imports: [SvgIconDirective, NgClass],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = iconVariants;
}
