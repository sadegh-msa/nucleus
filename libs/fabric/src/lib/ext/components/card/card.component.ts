import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'fab-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
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
