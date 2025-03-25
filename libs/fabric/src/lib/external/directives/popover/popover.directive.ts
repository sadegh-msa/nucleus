import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  Input,
  OnDestroy,
  OnInit,
  untracked
} from '@angular/core';
import { BubbleComponent } from '../../components';
import { HtmlService, PopoverService } from '../../services';
import { FabPosition } from '../../types';


@Directive({
  selector: '[fabPopover]',

})
export class PopoverDirective implements OnInit, OnDestroy {
  readonly #injector = inject(Injector);
  readonly #elementRef = inject(ElementRef);
  readonly #popoverService = inject(PopoverService);
  readonly #htmlService = inject(HtmlService);

  #htmlObserver!: MutationObserver;

  @Input({ alias: 'fabPopover', required: true }) bubbleComponent!: BubbleComponent;
  @Input({ alias: 'fabPopoverIsDismissible' }) isDismissible = true;

  @Input({ alias: 'fabPopoverShowCloseButton' })
  set showCloseButton(showCloseButton: boolean) {
    this.bubbleComponent.showCloseButton = showCloseButton;
  }

  fabPopoverPosition = input<FabPosition>('top-center');
  fabPopoverEvent = input<'click' | 'mouseover'>('mouseover');

  get hostElement() {
    return this.#elementRef.nativeElement;
  }

  get bubbleElement() {
    return this.bubbleComponent.hostElement;
  }

  constructor() {
    this.#handleEvents();
  }

  ngOnInit() {
    this.bubbleComponent.hide();
    this.bubbleComponent.float();
  }

  ngOnDestroy() {
    this.#htmlObserver.disconnect();
  }

  #handleEvents() {
    effect(() => {
      const position = this.fabPopoverPosition();

      untracked(() => {
        this.bubbleComponent.position.set(position);
        this.attachToTrigger();
      });
    }, { injector: this.#injector });

    this.#htmlObserver = new MutationObserver(list => {
      if (list.length && list[0].attributeName === 'dir') {
        this.attachToTrigger();
      }
    });

    this.#htmlObserver.observe(
      document.getElementsByTagName('html')[0],
      { attributes: true, childList: false, subtree: false, attributeFilter: ['dir'] }
    );
  }

  attachToTrigger() {
    this.#popoverService.attachToTrigger(
      this.bubbleElement,
      this.hostElement,
      this.fabPopoverPosition()
    );
  }

  togglePopover() {
    if (!this.bubbleComponent.isVisible()) {
      this.attachToTrigger();
    }

    this.bubbleComponent.toggle();
  }

  @HostListener('mouseover', ['$event.target'])
  handleMouseOverEvent() {
    if (this.fabPopoverEvent() === 'mouseover') {
      this.togglePopover();
    }
  }

  @HostListener('click', ['$event.target'])
  handleClickEvent() {
    if (this.fabPopoverEvent() === 'click') {
      this.togglePopover();
    }
  }

  @HostListener('window:click', ['$event.target'])
  onWindowClick(target: HTMLElement) {
    if (!this.isDismissible
      || this.#htmlService.areElementsOverlapped(target, this.bubbleElement)
      || this.#htmlService.areElementsOverlapped(target, this.hostElement)) {
      return;
    }

    this.bubbleComponent.hide();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.attachToTrigger();
  }
}
