import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { BubbleComponent, type FabPosition, fabPositions, PopoverDirective } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-popover',
  imports: [CommonModule, BubbleComponent, PopoverDirective, SvgIconComponent],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  readonly positions = fabPositions.filter(i => !i.includes('auto')).map((i) => i as FabPosition);
  popoverEvent = signal<'click' | 'hover'>('click');

  togglePopoverEvent() {
    const event = this.popoverEvent() == 'hover' ? 'click' : 'hover';
    this.popoverEvent.set(event);
  }
}
