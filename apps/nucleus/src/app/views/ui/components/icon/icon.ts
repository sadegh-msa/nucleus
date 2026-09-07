import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { UiSvgIcon, uiIconVariants } from '@nucleus/ui';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-icon',
  imports: [UiSvgIcon, NgClass],
  templateUrl: './icon.html',
})
export class Icon {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = uiIconVariants;
}
