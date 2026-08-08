import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  effect,
  Injector,
  inject,
  input,
  model,
  type OnDestroy,
  Renderer2,
  untracked,
} from '@angular/core';
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass } from '../../../int/constants';
import type { UiPopoverModel } from '../../models';
import { UiPopoverBuilder } from '../../services/popover-builder';
import type { UiPlacementType } from '../../types';

const tooltipConfig = uiDefaultConfig.tooltip;
const tooltipStyleClass = uiStyleClass.tooltip;

@Directive({
  selector: '[uiTooltip]',
})
export class UiTooltip implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #uiPopoverBuilder = inject(UiPopoverBuilder);

  content = input.required<UiPopoverModel['content']>({ alias: 'uiTooltip' });
  templateData = input<unknown>({}, { alias: 'uiTooltipData' });
  placement = input<UiPlacementType>(tooltipConfig.placement, { alias: 'uiTooltipPlacement' });
  hasBubble = input(tooltipConfig.hasBubble, {
    alias: 'uiTooltipHasBubble',
    transform: booleanAttribute,
  });
  hasArrow = input(tooltipConfig.hasArrow, {
    alias: 'uiTooltipArrow',
    transform: booleanAttribute,
  });
  attachTo = input<UiPopoverModel['attachTo']>(tooltipConfig.attachTo, {
    alias: 'uiTooltipAttachTo',
  });
  disabled = input(tooltipConfig.disabled, {
    alias: 'uiTooltipDisabled',
    transform: booleanAttribute,
  });
  styleClass = input(tooltipStyleClass.optional, { alias: 'uiTooltipStyleClass' });

  visible = model(false, { alias: 'uiTooltipVisible' });

  readonly popover = computed(
    () =>
      ({
        content: this.content(),
        templateData: this.templateData(),
        styleClass: [tooltipStyleClass.basic, this.styleClass()].join(' '),
        placement: this.placement(),
        hasBubble: this.hasBubble(),
        hasArrow: this.hasArrow(),
        hasClose: false,
        closeDelay: 0,
        attachTo: this.attachTo(),
        visible: this.visible,
      }) as UiPopoverModel,
  );

  tooltipElement?: HTMLElement;
  #cleanUpTriggerListener = () => {};
  #cleanUpElementObservers = () => {};

  get triggerElement() {
    return this.#elementRef.nativeElement as HTMLElement;
  }

  constructor() {
    effect(() => {
      if (this.disabled()) {
        return;
      }

      const popover = this.popover();

      if (!popover.content) {
        return;
      }

      untracked(() => this.#handleTriggerEvents());
    });

    effect(() => {
      const disabled = this.disabled();
      const visible = this.visible() && !disabled;

      untracked(() => {
        if (!this.tooltipElement) {
          if (visible) {
            this.#renderTooltip();
          }

          if (!this.tooltipElement) {
            return;
          }
        }

        if (visible) {
          this.#uiPopoverBuilder.showPopover(this.tooltipElement);
        } else {
          this.#uiPopoverBuilder.hidePopover(this.tooltipElement);
        }

        if (disabled) {
          this.#cleanUpElementObservers();
        }
      });
    });
  }

  ngOnDestroy() {
    this.#cleanUpTriggerListener();
    this.#cleanUpElementObservers();
    this.tooltipElement?.remove();
  }

  #renderTooltip() {
    this.#cleanUpElementObservers();

    if (this.tooltipElement) {
      const parentNode = this.#renderer.parentNode(this.triggerElement);
      this.#renderer.removeChild(parentNode, this.tooltipElement);
    }

    const { popoverElement, cleanUpElementObservers } = this.#uiPopoverBuilder.render(
      this.#injector,
      tooltipConfig.triggerEvent,
      this.popover(),
    );

    this.tooltipElement = popoverElement;
    this.#cleanUpElementObservers = cleanUpElementObservers;
  }

  #handleTriggerEvents() {
    this.#cleanUpTriggerListener();

    if (this.tooltipElement) {
      this.#renderTooltip();
    }

    this.#cleanUpTriggerListener = this.#uiPopoverBuilder.handleTriggerEvents(
      this.#injector,
      tooltipConfig.triggerEvent,
      this.popover(),
      () => {
        if (!this.tooltipElement) {
          this.#renderTooltip();
        }

        return this.tooltipElement;
      },
    );
  }
}
