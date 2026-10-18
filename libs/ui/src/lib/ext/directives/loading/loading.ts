import {
  booleanAttribute,
  Directive,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  Renderer2,
  untracked,
} from '@angular/core';
import { uiHtmlId, uiStyleClass } from '../../../int/constants';
import { VisualObserver } from '../../helpers';
import type { UiElementRectModel } from '../../models';

const loadingStyleClass = uiStyleClass.loading;

@Directive({
  selector: '[uiLoading]',
})
export class UiLoading implements OnInit, OnDestroy {
  readonly #renderer = inject(Renderer2);
  readonly #document = inject(DOCUMENT);
  readonly #elementRef = inject(ElementRef);

  showLoading = input(false, { alias: 'uiLoading', transform: booleanAttribute });
  styleClass = input(loadingStyleClass.basic, { alias: 'uiLoadingStyleClass' });

  #loadingElement: HTMLElement | null = null;
  #targetVisualObserver: VisualObserver | null = null;

  get targetElement() {
    return this.#elementRef.nativeElement;
  }

  constructor() {
    effect(() => {
      const styleClass = this.styleClass();

      untracked(() => {
        if (this.#loadingElement) {
          this.#loadingElement.classList = styleClass;
        }
      });
    });

    effect(() => {
      const showLoading = this.showLoading();

      untracked(() => {
        if (showLoading) {
          this.appendLoadingElement();
        } else {
          this.removeLoadingElement();
        }
      });
    });
  }

  ngOnInit() {
    let setTimeoutHandler = 0;
    this.#targetVisualObserver = new VisualObserver(() => {
      clearTimeout(setTimeoutHandler);

      setTimeoutHandler = setTimeout(() => {
        this.updateLoadingElementPosition();
      }, 100);
    });

    this.#targetVisualObserver?.observe(this.targetElement);
  }

  ngOnDestroy() {
    this.#targetVisualObserver?.disconnect();
    this.removeLoadingElement();
  }

  getContainerElement() {
    const containerId = uiHtmlId.loading.container;
    let container = this.#document.getElementById(containerId);

    if (!container) {
      container = this.#renderer.createElement('div');

      if (container) {
        container.setAttribute('id', containerId);
        this.#renderer.appendChild(this.#document.body, container);
      }
    }

    return container;
  }

  getTargetElementRect() {
    return this.targetElement.getBoundingClientRect() as UiElementRectModel;
  }

  appendLoadingElement() {
    const container = this.getContainerElement();
    const element = this.#renderer.createElement('div');

    element.classList = this.styleClass();

    this.#renderer.appendChild(container, element);
    this.#loadingElement = element;
    this.updateLoadingElementPosition();
  }

  removeLoadingElement() {
    const container = this.getContainerElement();

    if (container && this.#loadingElement) {
      this.#renderer.removeChild(container, this.#loadingElement);
    }

    this.#loadingElement = null;
  }

  updateLoadingElementPosition() {
    const { left, top, width, height } = this.getTargetElementRect();
    const element = this.#loadingElement;

    if (element) {
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  }
}
