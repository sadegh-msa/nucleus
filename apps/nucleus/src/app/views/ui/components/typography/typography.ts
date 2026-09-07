import { Component } from '@angular/core';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.html',
})
export class Typography {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly weights = ['normal', 'semibold', 'bold', 'bolder'];
}
