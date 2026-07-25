import { DOCUMENT, ElementRef, type Injector, inject, Service } from '@angular/core';
import type { SetTimeout } from '@nucleus/common';
import { UiPopoverPositioner } from '../../int/services/popover-positioner';
import { UiPopoverRenderer } from '../../int/services/popover-renderer';
import type { TriggerEventModel, UiPopoverModel } from '../models';

const EVENT_MAP: Record<TriggerEventModel, keyof HTMLElementEventMap> = Object.freeze({
  click: 'pointerup',
  hover: 'pointerenter',
});

@Service()
export class UiPopoverBuilder {
  readonly #uiPopoverPositioner = inject(UiPopoverPositioner);
  readonly #uiPopoverRenderer = inject(UiPopoverRenderer);

  readonly EVENT_MAP = EVENT_MAP;

  render(injector: Injector, triggerEvent: TriggerEventModel, popover: UiPopoverModel) {
    return this.#uiPopoverRenderer.render(injector, triggerEvent, popover);
  }

  handleTriggerEvents(
    injector: Injector,
    triggerEvent: TriggerEventModel,
    popover: UiPopoverModel,
    getPopoverElement: () => HTMLElement | undefined,
  ) {
    const document = injector.get(DOCUMENT);
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = EVENT_MAP[triggerEvent];

    const observer = new IntersectionObserver(
      () => {
        if (!document.body.contains(triggerElement)) {
          observer.disconnect();
        }
      },
      {
        threshold: 1.0,
        // @ts-expect-error trackVisibility is experimental and not yet in the IntersectionObserver typings
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

      this.#uiPopoverPositioner.defineCssVars(injector, popoverElement);

      if (!popover.hasClose) {
        docPointerupAbortController = new AbortController();

        document.body.addEventListener(
          'pointerup',
          (pointerEvent) => {
            const isInsideEvent = this.#uiPopoverPositioner.isInsideEvent(
              injector,
              popoverElement,
              pointerEvent,
            );

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
              const isInsideEvent = this.#uiPopoverPositioner.isInsideEvent(
                injector,
                popoverElement,
                pointerEvent,
              );

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
    popoverElement.classList.remove('numb', 'transparent');
  }

  hidePopover(popoverElement: HTMLElement) {
    popoverElement.classList.add('numb', 'transparent');
  }

  dispatchTriggerEvent(injector: Injector, triggerEvent: TriggerEventModel) {
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = EVENT_MAP[triggerEvent];
    triggerElement.dispatchEvent(new Event(eventType));
  }
}
