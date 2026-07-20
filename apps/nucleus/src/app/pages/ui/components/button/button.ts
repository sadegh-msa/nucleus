import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RippleDirective, SvgIconDirective } from '@nucleus/ui';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet, TitleCasePipe, SvgIconDirective, RippleDirective],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = ['basic', 'bordered', 'bulk', 'emphasis', 'outline', 'second'];
}
