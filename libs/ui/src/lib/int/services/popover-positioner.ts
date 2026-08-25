import { ElementRef, type Injector, Renderer2, Service } from '@angular/core';
import { uiStyleClass, uiStyleVar } from '../constants';

const popoverStyleClass = uiStyleClass.popover;

@Service()
export class UiPopoverPositioner {
  defineCssVars(injector: Injector, popoverElement: HTMLElement) {
    const renderer = injector.get(Renderer2);
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const triggerDomRect = triggerElement.getBoundingClientRect();
    const popoverDomRect = popoverElement.getBoundingClientRect();

    let popoverStyle = popoverElement.getAttribute('style') ?? '';
    popoverStyle = popoverStyle.at(-1) !== ';' ? `${popoverStyle};` : popoverStyle;

    for (const [key, value] of Object.entries(triggerDomRect.toJSON())) {
      popoverStyle += `${uiStyleVar.trigger}-${key}:${value}px;`;
    }

    for (const [key, value] of Object.entries(popoverDomRect.toJSON())) {
      popoverStyle += `${uiStyleVar.popover}-${key}:${value}px;`;
    }

    popoverStyle += `z-index: ${popoverStyleClass.zIndex};`;

    renderer.setProperty(popoverElement, 'style', popoverStyle);
  }

  isInsideEvent(injector: Injector, popoverElement: HTMLElement, event: PointerEvent) {
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const target = event.target as HTMLElement;

    if (triggerElement?.isSameNode(target)) {
      return true;
    }

    const x = event.clientX;
    const y = event.clientY;
    const triggerRect = triggerElement.getBoundingClientRect();

    if (
      x > triggerRect.left &&
      x <= triggerRect.right &&
      y > triggerRect.top &&
      y <= triggerRect.bottom
    ) {
      return true;
    }

    if (popoverElement?.isSameNode(target)) {
      return true;
    }

    const popoverRect = popoverElement.getBoundingClientRect();

    return (
      x > popoverRect.left &&
      x <= popoverRect.right &&
      y > popoverRect.top &&
      y <= popoverRect.bottom
    );
  }
}
