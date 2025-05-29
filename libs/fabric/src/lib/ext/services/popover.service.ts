import { inject, Injectable } from '@angular/core';
import type { ElementRect } from '../models';
import type { FabPosition } from '../types';
import { HtmlService } from './html.service';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  readonly #htmlService = inject(HtmlService);
  readonly ARROW_SIZE = 10;

  #calculateBlockStart(bubble: ElementRect, trigger: ElementRect, position: FabPosition) {
    let blockStart = trigger.top;

    switch (position) {
      case 'block-auto-corner-auto':
      case 'block-start-corner-auto':
      case 'block-start-corner-start':
      case 'block-start-corner-end':
        blockStart -= bubble.height;
        break;

      case 'block-start-inline-start':
      case 'block-start-inline-center':
      case 'block-start-inline-end':
        blockStart -= bubble.height + this.ARROW_SIZE;
        break;

      case 'block-end-corner-auto':
      case 'block-end-corner-start':
      case 'block-end-corner-end':
        blockStart += trigger.height;
        break;

      case 'block-end-inline-auto':
      case 'block-end-inline-start':
      case 'block-end-inline-center':
      case 'block-end-inline-end':
        blockStart += trigger.height + this.ARROW_SIZE;
        break;

      case 'inline-start-block-start':
      case 'inline-end-block-start':
        blockStart -= bubble.height / 2 - trigger.height / 4;
        break;

      case 'inline-start-block-auto':
      case 'inline-start-block-center':
      case 'inline-end-block-auto':
      case 'inline-end-block-center':
        blockStart -= bubble.height / 2 - trigger.height / 2;
        break;

      case 'inline-start-block-end':
      case 'inline-end-block-end':
        blockStart += trigger.height / 2 - bubble.height / 4;
        break;
    }

    return blockStart;
  }

  #calculateInlineStart(bubble: ElementRect, trigger: ElementRect, position: FabPosition) {
    let inlineStart = trigger.left;

    switch (position) {
      case 'block-start-corner-auto':
      case 'block-start-corner-start':
      case 'block-end-corner-auto':
      case 'block-end-corner-start':
        inlineStart -= bubble.width;
        break;

      case 'block-start-inline-start':
      case 'block-end-inline-start':
        inlineStart -= bubble.width - trigger.width / 4 - 2 * this.ARROW_SIZE;
        break;

      case 'block-auto-corner-auto':
      case 'block-start-inline-center':
      case 'block-end-inline-auto':
      case 'block-end-inline-center':
        inlineStart -= bubble.width / 2 - trigger.width / 2;
        break;

      case 'block-start-inline-end':
      case 'block-end-inline-end':
        inlineStart += 0.75 * trigger.width - 2 * this.ARROW_SIZE;
        break;

      case 'block-start-corner-end':
      case 'block-end-corner-end':
        inlineStart += trigger.width;
        break;

      case 'inline-start-block-start':
      case 'inline-start-block-auto':
      case 'inline-start-block-center':
      case 'inline-start-block-end':
        inlineStart -= bubble.width + this.ARROW_SIZE;
        break;

      case 'inline-end-block-start':
      case 'inline-end-block-auto':
      case 'inline-end-block-center':
      case 'inline-end-block-end':
        inlineStart += trigger.width + this.ARROW_SIZE;
        break;
    }

    return inlineStart;
  }

  attachToTrigger(bubbleElement: HTMLElement, triggerElement: HTMLElement, position: FabPosition) {
    const bubbleRect = this.#htmlService.getElementRect(bubbleElement);
    const triggerRect = this.#htmlService.getElementRect(triggerElement);
    const blockStart = this.#calculateBlockStart(bubbleRect, triggerRect, position);
    const inlineStart = this.#calculateInlineStart(bubbleRect, triggerRect, position);

    triggerElement.style.position = 'relative';
    bubbleElement.style.insetBlockStart = `${blockStart}px`;
    bubbleElement.style.insetInlineStart = `${inlineStart}px`;
  }
}
