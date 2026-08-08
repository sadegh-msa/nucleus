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
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass } from '../../../int/constants';
import type { UiPopoverModel } from '../../models';
import { UiPopoverBuilder } from '../../services/popover-builder';
import type { TriggerEventType, UiPlacementType } from '../../types';

const popoverConfig = uiDefaultConfig.popover;
const popoverStyleClass = uiStyleClass.popover;

@Directive({
  selector: '[uiPopover]',
})
export class UiPopover implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #uiPopoverBuilder = inject(UiPopoverBuilder);

  content = input.required<UiPopoverModel['content']>({ alias: 'uiPopover' });
  templateData = input<unknown>({}, { alias: 'uiPopoverData' });
  triggerEvent = input<TriggerEventType>(popoverConfig.triggerEvent, { alias: 'uiPopoverEvent' });
  placement = input<UiPlacementType>(popoverConfig.placement, { alias: 'uiPopoverPlacement' });
  closeDelay = input(popoverConfig.closeDelay, { alias: 'uiPopoverCloseDelay' });
  hasBubble = input(popoverConfig.hasBubble, {
    alias: 'uiPopoverHasBubble',
    transform: booleanAttribute,
  });
  hasArrow = input(popoverConfig.hasArrow, {
    alias: 'uiPopoverHasArrow',
    transform: booleanAttribute,
  });
  hasClose = input(popoverConfig.hasClose, {
    alias: 'uiPopoverHasClose',
    transform: booleanAttribute,
  });
  attachTo = input<UiPopoverModel['attachTo']>(popoverConfig.attachTo, {
    alias: 'uiPopoverAttachTo',
  });
  disabled = input(popoverConfig.disabled, {
    alias: 'uiPopoverDisabled',
    transform: booleanAttribute,
  });
  styleClass = input(popoverStyleClass.optional, { alias: 'uiPopoverStyleClass' });

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
      }) as UiPopoverModel,
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
          this.#uiPopoverBuilder.showPopover(this.popoverElement);
        } else {
          this.#uiPopoverBuilder.hidePopover(this.popoverElement);
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

    const { popoverElement, cleanUpElementObservers } = this.#uiPopoverBuilder.render(
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

    this.#cleanUpTriggerListener = this.#uiPopoverBuilder.handleTriggerEvents(
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
