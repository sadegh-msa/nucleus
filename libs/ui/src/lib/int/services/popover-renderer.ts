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
import { uniquifyStyleClass, VisualObserver } from '../../ext/helpers';
import type { UiPopoverModel } from '../../ext/models';
import type { TriggerEventType } from '../../ext/types/trigger.type';
import { getCloseSvg, uiStyleClass, uiStyleId } from '../constants';
import { UiPopoverPositioner } from './popover-positioner';

const popoverStyleClass = uiStyleClass.popover;
const bubbleStyleClass = uiStyleClass.bubble;

@Service()
export class UiPopoverRenderer {
  readonly #uiPopoverPositioner = inject(UiPopoverPositioner);

  render(
    injector: Injector,
    triggerEvent: TriggerEventType,
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
    const styleClassAggregation = uniquifyStyleClass(
      uiStyleClass.prefix,
      popoverStyleClass.basic,
      ...popoverStyleClass.invisibility,
      hasBubble ? bubbleStyleClass.basic : '',
      styleClass,
      placement,
    );

    renderer.setAttribute(popoverElement, 'class', styleClassAggregation);

    if (content instanceof TemplateRef) {
      const embeddedViewRef = viewContainerRef.createEmbeddedView(
        content,
        {
          data: templateData,
          control: {
            close: () => visible.set(false)
          }
        },
        { injector },
      );
      embeddedViewRef.rootNodes.forEach((node: HTMLElement) => {
        renderer.appendChild(popoverElement, node);
      });
      embeddedViewRef.detectChanges();
    } else {
      const contentElement = renderer.createElement('p');
      contentElement.setHTML(content);
      renderer.appendChild(popoverElement, contentElement);
    }

    if (hasBubble) {
      if (hasArrow) {
        const bubbleArrow = renderer.createElement('i');
        renderer.setAttribute(bubbleArrow, 'class', bubbleStyleClass.arrow);
        renderer.appendChild(popoverElement, bubbleArrow);
      }

      if (triggerEvent === 'click' && hasClose) {
        const bubbleClose = renderer.createElement('button');
        renderer.setAttribute(bubbleClose, 'class', bubbleStyleClass.close);
        renderer.setProperty(bubbleClose, 'innerHTML', getCloseSvg());
        renderer.setProperty(bubbleClose, 'onclick', () => visible.set(false));
        renderer.appendChild(popoverElement, bubbleClose);
      }
    }

    const triggerElement = elementRef.nativeElement as HTMLElement;
    let container = renderer.parentNode(triggerElement);

    if (attachTo === 'body') {
      const containerId = uiStyleId.popover.container;
      container = document.getElementById(containerId);

      if (!container) {
        container = renderer.createElement('div');
        container.setAttribute('id', containerId);
        renderer.appendChild(document.body, container);
      }

      renderer.appendChild(container, popoverElement);
    } else if (attachTo === 'parent') {
      renderer.insertBefore(container, popoverElement, triggerElement);
    } else if (attachTo instanceof HTMLElement) {
      container = attachTo as HTMLElement;
      renderer.appendChild(container, popoverElement);
    }

    const isSubPopover = popoverElement.parentElement?.classList.contains(popoverStyleClass.basic);
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
