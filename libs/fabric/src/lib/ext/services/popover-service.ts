import {
  DOCUMENT,
  ElementRef,
  Injectable,
  type Injector,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import vizObserver from 'viz-observer';
import type { Popover, TriggerEvent } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  readonly #CSS_VAR_POPOVER = '--fab-popover';
  readonly #CSS_VAR_TRIGGER = '--fab-trigger';
  readonly #CSS_CLASS_POPOVER = 'fab popover';
  readonly #CSS_CLASS_BUBBLE = 'bubble';
  readonly #CSS_CLASS_ARROW = 'bubble-arrow';
  readonly #CSS_CLASS_CLOSE = 'fab button emphasis stamp tiny rounded-full bubble-close';
  readonly #CSS_CLASS_INVISIBLE = 'transparent';
  readonly #CSS_CONTAINER_ID = 'fab-popover-container';
  readonly #SVG_CLOSE =
    '<svg class="fab icon linear" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M 3.150239,3.150239 20.849761,20.849761" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M 20.99993,3.0000696 3.0000696,20.99993" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> </svg>';
  readonly EVENT_MAP: Record<TriggerEvent, keyof HTMLElementEventMap> = Object.freeze({
    click: 'pointerup',
    hover: 'pointerenter',
  });

  render(
    injector: Injector,
    triggerEvent: TriggerEvent,
    {
      content,
      templateData,
      styleClass,
      placement,
      hasBubble,
      hasArrow,
      hasClose,
      attachTo,
      visible,
    }: Popover,
  ) {
    const document = injector.get(DOCUMENT);
    const renderer = injector.get(Renderer2);
    const viewContainerRef = injector.get(ViewContainerRef);
    const elementRef = injector.get(ElementRef);
    const popoverElement = renderer.createElement('div');
    const allStyleClass = [
      this.#CSS_CLASS_INVISIBLE,
      this.#CSS_CLASS_POPOVER,
      hasBubble ? this.#CSS_CLASS_BUBBLE : '',
      styleClass,
      placement,
    ].join(' ');

    renderer.setAttribute(popoverElement, 'class', allStyleClass);

    if (content instanceof TemplateRef) {
      const embeddedViewRef = viewContainerRef.createEmbeddedView(content, {
        data: templateData,
      });
      embeddedViewRef.rootNodes.forEach((node: HTMLElement) => {
        renderer.appendChild(popoverElement, node);
      });
      embeddedViewRef.detectChanges();
    } else {
      const contentElement = renderer.createElement('p');
      contentElement.innerHTML = content;
      renderer.appendChild(popoverElement, contentElement);
    }

    if (hasBubble) {
      if (hasArrow) {
        const bubbleArrow = renderer.createElement('i');
        renderer.setAttribute(bubbleArrow, 'class', this.#CSS_CLASS_ARROW);
        renderer.appendChild(popoverElement, bubbleArrow);
      }

      if (triggerEvent === 'click' && hasClose) {
        const bubbleClose = renderer.createElement('button');
        renderer.setAttribute(bubbleClose, 'class', this.#CSS_CLASS_CLOSE);
        renderer.setProperty(bubbleClose, 'innerHTML', this.#SVG_CLOSE);
        renderer.setProperty(bubbleClose, 'onclick', () => visible.set(false));
        renderer.appendChild(popoverElement, bubbleClose);
      }
    }

    const triggerElement = elementRef.nativeElement as HTMLElement;
    let container = renderer.parentNode(triggerElement);

    if (attachTo === 'body') {
      container = document.getElementById(this.#CSS_CONTAINER_ID);

      if (!container) {
        container = renderer.createElement('div');
        container.setAttribute('id', this.#CSS_CONTAINER_ID);
        renderer.appendChild(document.body, container);
      }

      renderer.appendChild(container, popoverElement);
    } else if (attachTo === 'parent') {
      renderer.insertBefore(container, popoverElement, triggerElement);
    } else if (attachTo instanceof HTMLElement) {
      container = attachTo as HTMLElement;
      renderer.appendChild(container, popoverElement);
    }

    const cleanUpTriggerObserver = vizObserver(triggerElement, () => {
      this.defineCssVars(injector, popoverElement);
    });
    const cleanUpPopoverObserver = vizObserver(popoverElement, () => {
      this.defineCssVars(injector, popoverElement);
    });

    return {
      popoverElement,
      cleanUpElementObservers: () => {
        cleanUpTriggerObserver();
        cleanUpPopoverObserver();
      },
    };
  }

  defineCssVars(injector: Injector, popoverElement: HTMLElement) {
    const renderer = injector.get(Renderer2);
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const triggerDomRect = triggerElement.getBoundingClientRect();
    const popoverDomRect = popoverElement.getBoundingClientRect();

    let popoverStyle = popoverElement.getAttribute('style') || '';
    popoverStyle = popoverStyle.at(-1) !== ';' ? `${popoverStyle};` : popoverStyle;

    for (const [key, value] of Object.entries(triggerDomRect.toJSON())) {
      popoverStyle += `${this.#CSS_VAR_TRIGGER}-${key}:${value}px;`;
    }

    for (const [key, value] of Object.entries(popoverDomRect.toJSON())) {
      popoverStyle += `${this.#CSS_VAR_POPOVER}-${key}:${value}px;`;
    }

    popoverStyle += 'z-index: 200;';

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
      x <= triggerRect.right && //
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
      x <= popoverRect.right && //
      y > popoverRect.top &&
      y <= popoverRect.bottom
    );
  }

  handleTriggerEvents(
    injector: Injector,
    triggerEvent: TriggerEvent,
    popover: Popover,
    getPopoverElement: () => HTMLElement | undefined,
  ) {
    const document = injector.get(DOCUMENT);
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = this.EVENT_MAP[triggerEvent];

    const triggerAbortController = new AbortController();
    let docPointerupAbortController: AbortController;
    let docPointermoveAbortController: AbortController;

    const removeDocumentListeners = () => {
      docPointerupAbortController?.abort();
      docPointermoveAbortController?.abort();
    };
    const addDocumentListeners = () => {
      const popoverElement = getPopoverElement();
      removeDocumentListeners();

      if (!popoverElement) {
        return;
      }

      if (!popover.hasClose) {
        docPointerupAbortController = new AbortController();

        document.body.addEventListener(
          'pointerup',
          (pointerEvent) => {
            const isInsideEvent = this.isInsideEvent(injector, popoverElement, pointerEvent);

            if (popover.visible() && !isInsideEvent) {
              popover.visible.set(false);
            }
          },
          {
            signal: docPointerupAbortController.signal,
          },
        );
      }

      if (triggerEvent === 'hover') {
        let timeout = 0;
        docPointermoveAbortController = new AbortController();

        document.body.addEventListener(
          'pointermove',
          (pointerEvent) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              const isInsideEvent = this.isInsideEvent(injector, popoverElement, pointerEvent);

              if (popover.visible() && !isInsideEvent) {
                popover.visible.set(false);
              }
            }, popover.closeDelay ?? 0);
          },
          {
            signal: docPointermoveAbortController.signal,
          },
        );
      }
    };

    triggerElement.addEventListener(
      eventType,
      () => {
        const visible = !popover.visible();

        if (visible) {
          addDocumentListeners();
        } else {
          removeDocumentListeners();
        }

        setTimeout(() => {
          popover.visible.set(visible);
        }, 0);
      },
      { signal: triggerAbortController.signal },
    );

    triggerAbortController.signal.onabort = () => {
      removeDocumentListeners();
    };

    return () => {
      triggerAbortController.abort();
    };
  }

  showPopover(popoverElement: HTMLElement) {
    popoverElement.classList.remove(this.#CSS_CLASS_INVISIBLE);
  }

  hidePopover(popoverElement: HTMLElement) {
    popoverElement.classList.add(this.#CSS_CLASS_INVISIBLE);
  }

  dispatchTriggerEvent(injector: Injector, triggerEvent: TriggerEvent) {
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = this.EVENT_MAP[triggerEvent];
    triggerElement.dispatchEvent(new Event(eventType));
  }
}
