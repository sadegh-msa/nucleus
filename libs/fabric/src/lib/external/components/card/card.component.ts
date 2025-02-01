import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { componentStyleClass } from '../../configs';

@Component({
  selector: 'fab-card',
  standalone: true,
  templateUrl: './card.component.html',
  imports: [
    NgClass,
    NgTemplateOutlet,
    NgComponentOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @HostBinding('class') styleClass = componentStyleClass.card;

  @HostBinding('class.fab-card-horizontal')
  get horizontalStyleClass() {
    return this.orientation() === 'horizontal';
  }

  @HostBinding('class.fab-card-vertical')
  get verticalStyleClass() {
    return this.orientation() === 'vertical';
  }

  orientation = input<'vertical' | 'horizontal'>('vertical');
}
