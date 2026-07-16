import { Component } from '@angular/core';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly weights = ['normal', 'semibold', 'bold', 'bolder'];
}
