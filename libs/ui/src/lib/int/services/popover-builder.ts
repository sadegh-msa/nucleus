import { DOCUMENT, ElementRef, type Injector, inject, Service } from '@angular/core';
import type { SetTimeoutType } from '@nucleus/common';
import type { UiPopoverModel } from '../../ext/models';
import type { TriggerEventType } from '../../ext/types/trigger.type';
import { eventMap, uiStyleClass } from '../constants';
import { UiPopoverPositioner } from './popover-positioner';
import { UiPopoverRenderer } from './popover-renderer';

const popoverStyleClass = uiStyleClass.popover;

@Service()
export class UiPopoverBuilder {
  readonly #uiPopoverPositioner = inject(UiPopoverPositioner);
  readonly #uiPopoverRenderer = inject(UiPopoverRenderer);

  render(injector: Injector, triggerEvent: TriggerEventType, popover: UiPopoverModel) {
    return this.#uiPopoverRenderer.render(injector, triggerEvent, popover);
  }

  handleTriggerEvents(
    injector: Injector,
    triggerEvent: TriggerEventType,
    popover: UiPopoverModel,
    getPopoverElement: () => HTMLElement | undefined,
  ) {
    const document = injector.get(DOCUMENT);
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = eventMap.popover.opener[triggerEvent];

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
    let clickClosureAbortController: AbortController;
    let focusClosureAbortController: AbortController;
    let hoverClosureAbortController: AbortController;

    const removeEventListeners = () => {
      clickClosureAbortController?.abort();
      focusClosureAbortController?.abort();
      hoverClosureAbortController?.abort();
    };
    const addEventListeners = () => {
      const popoverElement = getPopoverElement();
      removeEventListeners();

      if (!popoverElement) {
        return;
      }

      this.#uiPopoverPositioner.defineCssVars(injector, popoverElement);

      if (!popover.hasClose) {
        clickClosureAbortController = new AbortController();

        document.body.addEventListener(
          eventMap.popover.closure.click,
          (pointerEvent) => {
            const isInsideEvent = this.#uiPopoverPositioner.isInsideEvent(
              injector,
              popoverElement,
              pointerEvent as PointerEvent,
            );

            if (popover.visible() && !isInsideEvent) {
              popover.visible.set(false);
            }
          },
          {
            signal: clickClosureAbortController.signal,
          },
        );
      }

      if (triggerEvent === 'focus') {
        focusClosureAbortController = new AbortController();

        document.body.addEventListener(
          eventMap.popover.closure.focus,
          () => popover.visible.set(false),
          {
            signal: focusClosureAbortController.signal,
          },
        );
      } else if (triggerEvent === 'hover') {
        let timeout: SetTimeoutType;
        hoverClosureAbortController = new AbortController();

        document.body.addEventListener(
          eventMap.popover.closure.hover,
          (pointerEvent) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              const isInsideEvent = this.#uiPopoverPositioner.isInsideEvent(
                injector,
                popoverElement,
                pointerEvent as PointerEvent,
              );

              if (popover.visible() && !isInsideEvent) {
                popover.visible.set(false);
              }
            }, popover.closeDelay ?? 0);
          },
          {
            signal: hoverClosureAbortController.signal,
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
    popoverElement.classList.remove(...popoverStyleClass.invisibility);
  }

  hidePopover(popoverElement: HTMLElement) {
    popoverElement.classList.add(...popoverStyleClass.invisibility);
  }

  dispatchTriggerEvent(injector: Injector, triggerEvent: TriggerEventType) {
    const elementRef = injector.get(ElementRef);
    const triggerElement = elementRef.nativeElement as HTMLElement;
    const eventType = eventMap.popover.opener[triggerEvent];

    triggerElement.dispatchEvent(new Event(eventType));
  }
}
