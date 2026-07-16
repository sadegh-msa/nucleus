import { Service } from '@angular/core';
import type { ElementRect } from '../models';

@Service()
export class HtmlService {
  getElementRect(element: HTMLElement): ElementRect {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
      height: element.offsetHeight,
      width: element.offsetWidth,
    };
  }

  areElementsOverlapped(firstElement: HTMLElement, secondElement: HTMLElement) {
    const firstRect = firstElement.getBoundingClientRect();
    const secondRect = secondElement.getBoundingClientRect();

    return (
      firstRect.left >= secondRect.left &&
      firstRect.right <= secondRect.right &&
      firstRect.top >= secondRect.top &&
      firstRect.bottom <= secondRect.bottom
    );
  }
}
