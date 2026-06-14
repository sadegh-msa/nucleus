import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RippleDirective, SvgIconDirective } from '@nucleus/fabric';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet, TitleCasePipe, SvgIconDirective, RippleDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = ['basic', 'bordered', 'bulk', 'emphasis', 'outline', 'second'];
}
