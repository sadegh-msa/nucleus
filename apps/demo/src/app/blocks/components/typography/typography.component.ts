import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { colors } from '../../shared/data/colors';
import { sizes } from '../../shared/data/sizes';

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyComponent {
  readonly colors = colors;
  readonly sizes = sizes;
  readonly weights = ['light', 'semibold', 'bold'];
}
