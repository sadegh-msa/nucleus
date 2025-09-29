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
import type { Popover, TriggerEvent } from '../../models';
import { PopoverService } from '../../services';
import type { FabPlacement } from '../../types';

@Directive({
  selector: '[fabTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #popoverService = inject(PopoverService);

  readonly #CSS_CLASS_TOOLTIP = 'tooltip';

  content = input.required<Popover['content']>({ alias: 'fabTooltip' });
  templateData = input<unknown>({}, { alias: 'fabTooltipData' });
  placement = input<FabPlacement>('auto', { alias: 'fabTooltipPlacement' });
  styleClass = input('stamp fade-normal', { alias: 'fabTooltipStyleClass' });
  hasBubble = input(true, { alias: 'fabTooltipHasBubble', transform: booleanAttribute });
  hasArrow = input(true, { alias: 'fabTooltipArrow', transform: booleanAttribute });
  attachTo = input<Popover['attachTo']>('parent', { alias: 'fabTooltipAttachTo' });
  disabled = input(false, { alias: 'fabTooltipDisabled', transform: booleanAttribute });

  visible = model(false, { alias: 'fabTooltipVisible' });

  readonly #TRIGGER_EVENT: TriggerEvent = 'hover';

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
      }) as Popover,
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

      this.popover();

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
