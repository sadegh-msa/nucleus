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
  output,
  Renderer2,
  untracked,
} from '@angular/core';
import type { Popover, TriggerEvent } from '../../models';
import { PopoverService } from '../../services';
import type { FabPlacement } from '../../types';

@Directive({
  selector: '[uiPopover]',
})
export class PopoverDirective implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #popoverService = inject(PopoverService);

  content = input.required<Popover['content']>({ alias: 'uiPopover' });
  templateData = input<unknown>({}, { alias: 'uiPopoverData' });
  triggerEvent = input<TriggerEvent>('click', { alias: 'uiPopoverEvent' });
  placement = input<FabPlacement>('auto', { alias: 'uiPopoverPlacement' });
  styleClass = input('text stamp fade-normal', { alias: 'uiPopoverStyleClass' });
  hasBubble = input(true, { alias: 'uiPopoverHasBubble', transform: booleanAttribute });
  hasArrow = input(true, { alias: 'uiPopoverHasArrow', transform: booleanAttribute });
  hasClose = input(false, { alias: 'uiPopoverHasClose', transform: booleanAttribute });
  closeDelay = input(0, { alias: 'uiPopoverCloseDelay' });
  attachTo = input<Popover['attachTo']>('body', { alias: 'uiPopoverAttachTo' });
  disabled = input(false, { alias: 'uiPopoverDisabled', transform: booleanAttribute });

  visible = model(false, { alias: 'uiPopoverVisible' });

  visibility = output<boolean>({ alias: 'uiPopoverVisibility' });

  readonly popover = computed(
    () =>
      ({
        content: this.content(),
        templateData: this.templateData(),
        styleClass: this.styleClass(),
        placement: this.placement(),
        hasBubble: this.hasBubble(),
        hasArrow: this.hasArrow(),
        hasClose: this.hasClose(),
        closeDelay: this.closeDelay(),
        attachTo: this.attachTo(),
        visible: this.visible,
      }) as Popover,
  );

  popoverElement?: HTMLElement;
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

      this.triggerEvent();

      untracked(() => this.#handleTriggerEvents());
    });

    effect(() => {
      const disabled = this.disabled();
      const visible = this.visible() && !disabled;

      untracked(() => {
        if (!this.popoverElement) {
          if (visible) {
            this.#renderPopover();
          }

          if (!this.popoverElement) {
            return;
          }
        }

        if (visible) {
          this.#popoverService.showPopover(this.popoverElement);
        } else {
          this.#popoverService.hidePopover(this.popoverElement);
        }

        if (disabled) {
          this.#cleanUpTriggerListener();
          this.#cleanUpElementObservers();
        }

        this.visibility.emit(visible);
      });
    });
  }

  ngOnDestroy() {
    this.#cleanUpTriggerListener();
    this.#cleanUpElementObservers();
    this.popoverElement?.remove();
  }

  #renderPopover() {
    this.#cleanUpElementObservers();

    if (this.popoverElement) {
      const parentNode = this.#renderer.parentNode(this.triggerElement);
      this.#renderer.removeChild(parentNode, this.popoverElement);
    }

    const { popoverElement, cleanUpElementObservers } = this.#popoverService.render(
      this.#injector,
      this.triggerEvent(),
      this.popover(),
    );

    this.popoverElement = popoverElement;
    this.#cleanUpElementObservers = cleanUpElementObservers;
  }

  #handleTriggerEvents() {
    this.#cleanUpTriggerListener();

    if (this.popoverElement) {
      this.#renderPopover();
    }

    this.#cleanUpTriggerListener = this.#popoverService.handleTriggerEvents(
      this.#injector,
      this.triggerEvent(),
      this.popover(),
      () => {
        if (!this.popoverElement) {
          this.#renderPopover();
        }

        return this.popoverElement;
      },
    );
  }
}
