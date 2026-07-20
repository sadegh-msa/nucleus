import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconDirective, uiIconVariants } from '@nucleus/ui';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-icon',
  imports: [SvgIconDirective, NgClass],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = uiIconVariants;
}
