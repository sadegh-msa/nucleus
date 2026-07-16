import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  type FabPlacement,
  PopoverDirective,
  SvgIconDirective,
  TooltipDirective,
  uiPlacement,
} from '@nucleus/ui';

@Component({
  selector: 'app-popover',
  imports: [SvgIconDirective, NgClass, NgTemplateOutlet, PopoverDirective, TooltipDirective],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  readonly placements = uiPlacement
    .filter((i) => !i.includes('auto'))
    .map((i) => i as FabPlacement);
  readonly popoverEvent = signal<'click' | 'hover'>('click');
  readonly popoverHasBubble = signal(true);
  readonly popoverHasClose = signal(false);
  readonly popoverHasArrow = signal(true);
  readonly popoverDisabled = signal(false);

  togglePopoverEvent() {
    const event = this.popoverEvent() === 'hover' ? 'click' : 'hover';
    this.popoverEvent.set(event);
  }

  togglePopoverHasBubble() {
    this.popoverHasBubble.set(!this.popoverHasBubble());
  }

  togglePopoverHasClose() {
    this.popoverHasClose.set(!this.popoverHasClose());
  }

  togglePopoverHasArrow() {
    this.popoverHasArrow.set(!this.popoverHasArrow());
  }

  togglePopoverDisabled() {
    this.popoverDisabled.set(!this.popoverDisabled());
  }
}
