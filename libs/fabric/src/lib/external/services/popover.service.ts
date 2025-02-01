import { inject, Injectable } from '@angular/core';
import { ElementRect } from '../models';
import { FabPosition } from '../types';
import { HtmlService } from './html.service';


@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  readonly #htmlService = inject(HtmlService);

  #calculateTop(bubble: ElementRect, trigger: ElementRect, position: FabPosition) {
    let top = trigger.top;

    switch (position) {
      case 'top-start':
      case 'top-center':
      case 'top-end':
        top -= bubble.height;
        break;

      case 'bottom-start':
      case 'bottom-center':
      case 'bottom-end':
        top += trigger.height;
        break;

      case 'start-top':
      case 'end-top':
        top += trigger.height / 2 - bubble.height;
        break;

      case 'start-center':
      case 'end-center':
        top += trigger.height / 2 - bubble.height / 2;
        break;

      case 'start-bottom':
      case 'end-bottom':
        top += trigger.height / 2;
        break;
    }

    return top;
  }

  #calculateLeft(bubble: ElementRect, trigger: ElementRect, position: FabPosition) {
    let left = trigger.left;

    switch (position) {
      case 'top-start':
      case 'bottom-start':
        left += trigger.width - trigger.width / 2 - bubble.width;
        break;

      case 'top-center':
      case 'bottom-center':
        left += trigger.width / 2 - bubble.width / 2;
        break;

      case 'top-end':
      case 'bottom-end':
        left += trigger.width / 2;
        break;

      case 'start-top':
      case 'start-center':
      case 'start-bottom':
        left -= bubble.width;
        break;

      case 'end-top':
      case 'end-center':
      case 'end-bottom':
        left += trigger.width;
        break;
    }

    return left;
  }

  attachToTrigger(bubbleElement: HTMLElement, triggerElement: HTMLElement, position: FabPosition) {
    const bubble = this.#htmlService.getElementRect(bubbleElement);
    const trigger = this.#htmlService.getElementRect(triggerElement);
    let bidiPosition = position;

    if (this.#htmlService.isRtl) {
      if (position.includes('start')) {
        bidiPosition = position.replace('start', 'end') as FabPosition;
      } else if (position.includes('end')) {
        bidiPosition = position.replace('end', 'start') as FabPosition;
      }
    }

    const top = this.#calculateTop(bubble, trigger, bidiPosition);
    const left = this.#calculateLeft(bubble, trigger, bidiPosition);
    const style = `left: ${left}px; top: ${top}px;`;

    bubbleElement.setAttribute('style', style);
  }
}
