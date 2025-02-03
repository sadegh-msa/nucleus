import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { componentStyleClass } from '../../configs';

@Component({
    selector: 'fab-card',
    templateUrl: './card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
