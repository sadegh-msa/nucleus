import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  type TriggerEventType,
  type UiPlacementType,
  UiPopover,
  UiSvgIcon,
  UiTooltip,
  uiPlacements,
} from '@nucleus/ui';

@Component({
  selector: 'app-popover',
  imports: [UiSvgIcon, NgClass, NgTemplateOutlet, UiPopover, UiTooltip],
  templateUrl: './popover.html',
  styleUrl: './popover.scss',
})
export class Popover {
  readonly placements = uiPlacements
    .filter((i) => !i.includes('auto'))
    .map((i) => i as UiPlacementType);
  readonly popoverEvent = signal<TriggerEventType>('click');
  readonly popoverHasBubble = signal(true);
  readonly popoverHasClose = signal(false);
  readonly popoverHasArrow = signal(true);
  readonly popoverDisabled = signal(false);

  togglePopoverEvent() {
    const event = this.popoverEvent();
    this.popoverEvent.set(event === 'click' ? 'focus' : event === 'focus' ? 'hover' : 'click');
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
