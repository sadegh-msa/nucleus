import {
  DOCUMENT,
  ElementRef,
  type Injector,
  Renderer2,
  Service,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { SetTimeout } from '@nucleus/common';
import { VisualObserver } from '../helpers/viz-observer';
import type { Popover, TriggerEvent } from '../models';

@Service()
export class PopoverService {
  readonly #CSS = Object.freeze({
    VAR: {
      POPOVER: '--fab-popover',
      TRIGGER: '--fab-trigger',
    },
    ID: {
      CONTAINER: 'fab-popover-container',
    },
    CLASS: {
      POPOVER: 'fab popover',
      BUBBLE: 'bubble',
      ARROW: 'bubble-arrow',
      CLOSE: 'fab button emphasis stamp tiny rounded-full bubble-close',
      INVISIBLE: 'transparent',
      NUMB: 'numb',
    },
  });
  readonly #SVG = Object.freeze({
    CLOSE:
      '<svg class="fab icon linear" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M 3.150239,3.150239 20.849761,20.849761" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M 20.99993,3.0000696 3.0000696,20.99993" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> </svg>',
  });
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
      this.#CSS.CLASS.NUMB,
      this.#CSS.CLASS.INVISIBLE,
      this.#CSS.CLASS.POPOVER,
      hasBubble ? this.#CSS.CLASS.BUBBLE : '',
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
        renderer.setAttribute(bubbleArrow, 'class', this.#CSS.CLASS.ARROW);
        renderer.appendChild(popoverElement, bubbleArrow);
      }

      if (triggerEvent === 'click' && hasClose) {
        const bubbleClose = renderer.createElement('button');
        renderer.setAttribute(bubbleClose, 'class', this.#CSS.CLASS.CLOSE);
        renderer.setProperty(bubbleClose, 'innerHTML', this.#SVG.CLOSE);
        renderer.setProperty(bubbleClose, 'onclick', () => visible.set(false));
        renderer.appendChild(popoverElement, bubbleClose);
      }
    }

    const triggerElement = elementRef.nativeElement as HTMLElement;
    let container = renderer.parentNode(triggerElement);

    if (attachTo === 'body') {
      container = document.getElementById(this.#CSS.ID.CONTAINER);

      if (!container) {
        container = renderer.createElement('div');
        container.setAttribute('id', this.#CSS.ID.CONTAINER);
        renderer.appendChild(document.body, container);
      }

      renderer.appendChild(container, popoverElement);
    } else if (attachTo === 'parent') {
      renderer.insertBefore(container, popoverElement, triggerElement);
    } else if (attachTo instanceof HTMLElement) {
      container = attachTo as HTMLElement;
      renderer.appendChild(container, popoverElement);
    }

    const isSubPopover = popoverElement.parentElement?.classList.contains(this.#CSS.CLASS.POPOVER);
    const triggerVisualObserver = isSubPopover
      ? null
      : new VisualObserver(() => {
          const opacity = Number.parseFloat(window.getComputedStyle(popoverElement).opacity);

          if (opacity > 0) {
            this.defineCssVars(injector, popoverElement);
          }
        });
    const popoverVisualObserver = new VisualObserver(() => {
      this.defineCssVars(injector, popoverElement);
    });

    triggerVisualObserver?.observe(triggerElement);
    popoverVisualObserver.observe(popoverElement);

    return {
      popoverElement,
      cleanUpElementObservers: () => {
        triggerVisualObserver?.disconnect();
        popoverVisualObserver.disconnect();
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
      popoverStyle += `${this.#CSS.VAR.TRIGGER}-${key}:${value}px;`;
    }

    for (const [key, value] of Object.entries(popoverDomRect.toJSON())) {
      popoverStyle += `${this.#CSS.VAR.POPOVER}-${key}:${value}px;`;
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

    const observer = new IntersectionObserver(
      () => {
        if (!document.body.contains(triggerElement)) {
          observer.disconnect();
          getPopoverElement()?.remove();
          triggerElement.remove();
        }
      },
      {
        threshold: 1.0,
        // @ts-expect-error
        delay: 500,
        trackVisibility: true,
      },
    );
    observer.observe(triggerElement);

    const triggerAbortController = new AbortController();
    let docPointerupAbortController: AbortController;
    let docPointermoveAbortController: AbortController;

    const removeEventListeners = () => {
      docPointerupAbortController?.abort();
      docPointermoveAbortController?.abort();
    };
    const addEventListeners = () => {
      const popoverElement = getPopoverElement();
      removeEventListeners();

      if (!popoverElement) {
        return;
      }

      this.defineCssVars(injector, popoverElement);

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
        let timeout: SetTimeout;
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
          addEventListeners();
        } else {
          removeEventListeners();
        }

        setTimeout(() => {
          popover.visible.set(visible);
        }, 0);
      },
      { signal: triggerAbortController.signal },
    );

    triggerAbortController.signal.onabort = () => {
      removeEventListeners();

      setTimeout(() => {
        observer.disconnect();
      }, 1000);
    };

    return () => {
      triggerAbortController.abort();
    };
  }

  showPopover(popoverElement: HTMLElement) {
    const { NUMB, INVISIBLE } = this.#CSS.CLASS;
    popoverElement.classList.remove(NUMB, INVISIBLE);
  }

  hidePopover(popoverElement: HTMLElement) {
    const { NUMB, INVISIBLE } = this.#CSS.CLASS;
    popoverElement.classList.add(NUMB, INVISIBLE);
  }

  dispatchTriggerEvent(injector: Injector, triggerEvent: TriggerEvent) {
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = this.EVENT_MAP[triggerEvent];
    triggerElement.dispatchEvent(new Event(eventType));
  }
}
