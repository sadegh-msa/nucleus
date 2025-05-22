import { Injectable } from '@angular/core';
import { ElementRect } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HtmlService {
  get isRtl() {
    return document.dir === 'rtl';
  }

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
