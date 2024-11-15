import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { colors, sizes } from '../../shared/data';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, SvgIconComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly ICON = 'icons/outline/tick-circle.svg';
  readonly colors = colors;
  readonly sizes = sizes;
  readonly variants = ['bulk', '', 'outline', 'text'];
}
