import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import type { BubbleComponent } from '../../components';
import { HtmlService, PopoverService } from '../../services';
import type { FabPosition } from '../../types';

@Directive({
  selector: '[fabPopover]',
})
export class PopoverDirective implements OnInit, OnDestroy {
  readonly #injector = inject(Injector);
  readonly #elementRef = inject(ElementRef);
  readonly #popoverService = inject(PopoverService);
  readonly #htmlService = inject(HtmlService);

  #htmlObserver!: MutationObserver;
  #mainElement = document.getElementsByTagName('main')[0];

  bubbleComponent = input.required<BubbleComponent>({ alias: 'fabPopover' });
  isDismissible = input(true, { alias: 'fabPopoverIsDismissible' });
  showCloseButton = input(false, { alias: 'fabPopoverShowCloseButton' });
  fabPopoverPosition = input<FabPosition>('auto');
  fabPopoverEvent = input<'click' | 'hover'>('hover');

  get hostElement() {
    return this.#elementRef.nativeElement;
  }

  get bubbleElement() {
    return this.bubbleComponent().hostElement;
  }

  constructor() {
    this.#mainElement.addEventListener('scroll', this.onMainScroll.bind(this));

    effect(() => {
      const showCloseButton = this.fabPopoverEvent() === 'click' && this.showCloseButton();

      untracked(() => {
        this.bubbleComponent().showCloseButton.set(showCloseButton);
      });
    });

    this.#handleEvents();
  }

  ngOnInit() {
    this.bubbleComponent().hide();
    this.bubbleComponent().float();
  }

  ngOnDestroy() {
    this.#mainElement.removeEventListener('scroll', this.onMainScroll.bind(this));
    this.#htmlObserver.disconnect();
  }

  #handleEvents() {
    effect(
      () => {
        const position = this.fabPopoverPosition();

        untracked(() => {
          this.bubbleComponent().position.set(position);
          this.attachToTrigger();
        });
      },
      { injector: this.#injector },
    );

    this.#htmlObserver = new MutationObserver((list) => {
      if (list.length && list[0].attributeName === 'dir') {
        this.attachToTrigger();
      }
    });

    this.#htmlObserver.observe(document.getElementsByTagName('html')[0], {
      attributes: true,
      childList: false,
      subtree: false,
      attributeFilter: ['dir'],
    });
  }

  attachToTrigger() {
    this.#popoverService.attachToTrigger(
      this.bubbleElement,
      this.hostElement,
      this.fabPopoverPosition(),
    );
  }

  togglePopover() {
    if (!this.bubbleComponent().isVisible()) {
      this.attachToTrigger();
    }

    this.bubbleComponent().toggle();
  }

  showPopover() {
    this.attachToTrigger();
    this.bubbleComponent().show();
  }

  hidePopover() {
    this.bubbleComponent().hide();
  }

  @HostListener('pointerenter', ['$event.target'])
  handleMouseOverEvent() {
    if (this.fabPopoverEvent() === 'hover') {
      this.showPopover();
    }
  }

  @HostListener('pointerleave', ['$event.target'])
  onPointerLeave(target: HTMLElement) {
    if (
      this.fabPopoverEvent() !== 'hover' ||
      !this.isDismissible ||
      target.isEqualNode(this.bubbleElement) ||
      this.#htmlService.areElementsOverlapped(target, this.bubbleElement)
    ) {
      return;
    }

    this.hidePopover();
  }

  @HostListener('click', ['$event.target'])
  handleClickEvent() {
    if (this.fabPopoverEvent() === 'click') {
      this.togglePopover();
    }
  }

  @HostListener('window:click', ['$event.target'])
  onWindowClick(target: HTMLElement) {
    if (
      this.fabPopoverEvent() !== 'click' ||
      !this.isDismissible ||
      target.isEqualNode(this.bubbleElement) ||
      target.isEqualNode(this.hostElement) ||
      this.#htmlService.areElementsOverlapped(target, this.bubbleElement) ||
      this.#htmlService.areElementsOverlapped(target, this.hostElement)
    ) {
      return;
    }

    this.hidePopover();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.attachToTrigger();
  }

  onMainScroll() {
    this.hidePopover();
  }
}
