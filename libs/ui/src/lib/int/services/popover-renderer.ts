import {
  DOCUMENT,
  ElementRef,
  type Injector,
  inject,
  Renderer2,
  Service,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { VisualObserver } from '../../ext/helpers/viz-observer';
import type { TriggerEventModel, UiPopoverModel } from '../../ext/models';
import { UiPopoverPositioner } from './popover-positioner';

const CSS = Object.freeze({
  ID: {
    CONTAINER: 'ui-popover-container',
  },
  CLASS: {
    POPOVER: 'ui popover',
    BUBBLE: 'bubble',
    ARROW: 'bubble-arrow',
    CLOSE: 'ui button emphasis stamp tiny rounded-full bubble-close',
    INVISIBLE: 'transparent',
    NUMB: 'numb',
  },
});

const SVG = Object.freeze({
  CLOSE:
    '<svg class="ui icon linear" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M 3.150239,3.150239 20.849761,20.849761" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M 20.99993,3.0000696 3.0000696,20.99993" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> </svg>',
});

@Service()
export class UiPopoverRenderer {
  readonly #uiPopoverPositioner = inject(UiPopoverPositioner);

  render(
    injector: Injector,
    triggerEvent: TriggerEventModel,
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
    }: UiPopoverModel,
  ) {
    const document = injector.get(DOCUMENT);
    const renderer = injector.get(Renderer2);
    const viewContainerRef = injector.get(ViewContainerRef);
    const elementRef = injector.get(ElementRef);
    const popoverElement = renderer.createElement('div');
    const allStyleClass = [
      CSS.CLASS.NUMB,
      CSS.CLASS.INVISIBLE,
      CSS.CLASS.POPOVER,
      hasBubble ? CSS.CLASS.BUBBLE : '',
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
        renderer.setAttribute(bubbleArrow, 'class', CSS.CLASS.ARROW);
        renderer.appendChild(popoverElement, bubbleArrow);
      }

      if (triggerEvent === 'click' && hasClose) {
        const bubbleClose = renderer.createElement('button');
        renderer.setAttribute(bubbleClose, 'class', CSS.CLASS.CLOSE);
        renderer.setProperty(bubbleClose, 'innerHTML', SVG.CLOSE);
        renderer.setProperty(bubbleClose, 'onclick', () => visible.set(false));
        renderer.appendChild(popoverElement, bubbleClose);
      }
    }

    const triggerElement = elementRef.nativeElement as HTMLElement;
    let container = renderer.parentNode(triggerElement);

    if (attachTo === 'body') {
      container = document.getElementById(CSS.ID.CONTAINER);

      if (!container) {
        container = renderer.createElement('div');
        container.setAttribute('id', CSS.ID.CONTAINER);
        renderer.appendChild(document.body, container);
      }

      renderer.appendChild(container, popoverElement);
    } else if (attachTo === 'parent') {
      renderer.insertBefore(container, popoverElement, triggerElement);
    } else if (attachTo instanceof HTMLElement) {
      container = attachTo as HTMLElement;
      renderer.appendChild(container, popoverElement);
    }

    const isSubPopover = popoverElement.parentElement?.classList.contains(CSS.CLASS.POPOVER);
    const triggerVisualObserver = isSubPopover
      ? null
      : new VisualObserver(() => {
          const opacity = Number.parseFloat(window.getComputedStyle(popoverElement).opacity);

          if (opacity > 0) {
            this.#uiPopoverPositioner.defineCssVars(injector, popoverElement);
          }
        });
    const popoverVisualObserver = new VisualObserver(() => {
      this.#uiPopoverPositioner.defineCssVars(injector, popoverElement);
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
}
