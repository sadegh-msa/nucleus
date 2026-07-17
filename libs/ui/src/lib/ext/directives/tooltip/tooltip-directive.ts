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
import type { PopoverModel, TriggerEventModel } from '../../models';
import { PopoverService } from '../../services';
import type { FabPlacement } from '../../types';

@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #popoverService = inject(PopoverService);

  readonly #CSS_CLASS_TOOLTIP = 'tooltip';

  content = input.required<PopoverModel['content']>({ alias: 'uiTooltip' });
  templateData = input<unknown>({}, { alias: 'uiTooltipData' });
  placement = input<FabPlacement>('auto', { alias: 'uiTooltipPlacement' });
  styleClass = input('stamp fade-normal', { alias: 'uiTooltipStyleClass' });
  hasBubble = input(true, { alias: 'uiTooltipHasBubble', transform: booleanAttribute });
  hasArrow = input(true, { alias: 'uiTooltipArrow', transform: booleanAttribute });
  attachTo = input<PopoverModel['attachTo']>('body', { alias: 'uiTooltipAttachTo' });
  disabled = input(false, { alias: 'uiTooltipDisabled', transform: booleanAttribute });

  visible = model(false, { alias: 'uiTooltipVisible' });

  readonly #TRIGGER_EVENT: TriggerEventModel = 'hover';

  readonly popover = computed(
    () =>
      ({
        content: this.content(),
        templateData: this.templateData(),
        styleClass: [this.#CSS_CLASS_TOOLTIP, this.styleClass()].join(' '),
        placement: this.placement(),
        hasBubble: this.hasBubble(),
        hasArrow: this.hasArrow(),
        hasClose: false,
        closeDelay: 0,
        attachTo: this.attachTo(),
        visible: this.visible,
      }) as PopoverModel,
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
          this.#popoverService.showPopover(this.tooltipElement);
        } else {
          this.#popoverService.hidePopover(this.tooltipElement);
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

    const { popoverElement, cleanUpElementObservers } = this.#popoverService.render(
      this.#injector,
      this.#TRIGGER_EVENT,
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

    this.#cleanUpTriggerListener = this.#popoverService.handleTriggerEvents(
      this.#injector,
      this.#TRIGGER_EVENT,
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
