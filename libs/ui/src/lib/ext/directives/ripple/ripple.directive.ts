import { booleanAttribute, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import type { SetTimeout } from '@nucleus/common';

type Pointer = 'pointer-down' | 'pointer-up';

@Directive({
  selector: '[uiRipple]',
  host: {
    class: 'rippler',
    '(pointerleave)': 'onPointerleave()',
    '(pointerdown)': 'onPointerdown($event)',
    '(pointerup)': 'onPointerup($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class RippleDirective {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  readonly #DURATION = 1000;
  readonly #TAG = 's';
  readonly #UI_STYLE_CLASS = 'ui';
  readonly #RIPPLE_STYLE_CLASS = 'ripple';
  readonly #FINISH_STYLE_CLASS = 'finish';

  isEnabled = input(true, { alias: 'uiRipple', transform: booleanAttribute });
  #timeoutHandler?: SetTimeout;
  #lastEvent: Pointer | null = null;
  #ripple?: HTMLElement;

  #setRippleVar(element: HTMLElement, name: string, value: string) {
    element.style.setProperty(
      `--${this.#UI_STYLE_CLASS}-${this.#RIPPLE_STYLE_CLASS}-${name}`,
      value,
    );
  }

  #clearHostElement() {
    const hostElement = this.#elementRef.nativeElement;
    const oldRipples = hostElement.getElementsByClassName(this.#RIPPLE_STYLE_CLASS);

    while (oldRipples[0]) {
      oldRipples[0].parentNode.removeChild(oldRipples[0]);
    }

    this.#ripple = undefined;
  }

  #attachRipple(layerX: number, layerY: number, pointer: Pointer = 'pointer-up') {
    if (!this.isEnabled()) {
      return;
    }

    this.#lastEvent = pointer;

    if (this.#ripple) {
      clearTimeout(this.#timeoutHandler);

      const ripple = this.#ripple;
      ripple.classList.remove(this.#lastEvent, this.#FINISH_STYLE_CLASS);
      ripple.classList.add(pointer, this.#FINISH_STYLE_CLASS);

      this.#timeoutHandler = setTimeout(() => {
        ripple.remove();
      }, this.#DURATION);
      this.#ripple = undefined;

      return;
    }

    this.#clearHostElement();

    const hostElement = this.#elementRef.nativeElement;
    const ripple = this.#renderer.createElement(this.#TAG);
    ripple.classList.add(this.#UI_STYLE_CLASS, this.#RIPPLE_STYLE_CLASS, pointer);

    this.#renderer.appendChild(hostElement, ripple);

    const size = Math.max(hostElement.clientHeight, hostElement.clientWidth);

    this.#setRippleVar(ripple, 'left', layerX > -1 ? `${layerX - size / 2}px` : 'auto');
    this.#setRippleVar(ripple, 'top', layerY > -1 ? `${layerY - size / 2}px` : 'auto');
    this.#setRippleVar(ripple, 'height', `${size}px`);
    this.#setRippleVar(ripple, 'width', `${size}px`);
    ripple.classList.add(this.#FINISH_STYLE_CLASS);

    this.#ripple = ripple;
  }

  onPointerleave() {
    if (this.#lastEvent === 'pointer-down') {
      this.#clearHostElement();
    }
  }

  onPointerdown(event: PointerEvent) {
    this.#attachRipple(event.layerX, event.layerY, 'pointer-down');
  }

  onPointerup(event: PointerEvent) {
    this.#attachRipple(event.layerX, event.layerY);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.#attachRipple(-1, -1);
    }
  }
}
