import { ChangeDetectionStrategy, Component } from '@angular/core';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly weights = ['light', '', 'semibold', 'bold', 'extrabold'];
}
