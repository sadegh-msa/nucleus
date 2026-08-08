import { booleanAttribute, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import type { SetTimeoutType } from '@nucleus/common';
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass, uiStyleVar } from '../../../int/constants';

type Pointer = 'pointer-down' | 'pointer-up';

const rippleConfig = uiDefaultConfig.ripple;
const rippleStyleClass = uiStyleClass.ripple;
const rippleStyleClassBasicArray = rippleStyleClass.basic.split(' ');

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
export class UiRipple {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  #timeoutHandler?: SetTimeoutType;
  #lastEvent: Pointer | null = null;
  #ripple?: HTMLElement;

  isEnabled = input(true, { alias: 'uiRipple', transform: booleanAttribute });

  #setRippleVar(element: HTMLElement, name: string, value: string) {
    element.style.setProperty(`${uiStyleVar.ripple}-${name}`, value);
  }

  #clearHostElement() {
    const hostElement = this.#elementRef.nativeElement;
    const oldRipples = hostElement.getElementsByClassName(rippleStyleClass.basic);

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
      ripple.classList.remove(this.#lastEvent, rippleStyleClass.ending);
      ripple.classList.add(pointer, rippleStyleClass.ending);

      this.#timeoutHandler = setTimeout(() => {
        ripple.remove();
      }, rippleConfig.duration);
      this.#ripple = undefined;

      return;
    }

    this.#clearHostElement();

    const hostElement = this.#elementRef.nativeElement;
    const ripple = this.#renderer.createElement(rippleConfig.tag);
    ripple.classList.add(...rippleStyleClassBasicArray, pointer);

    this.#renderer.appendChild(hostElement, ripple);

    const size = Math.max(hostElement.clientHeight, hostElement.clientWidth);

    this.#setRippleVar(ripple, 'left', layerX > -1 ? `${layerX - size / 2}px` : 'auto');
    this.#setRippleVar(ripple, 'top', layerY > -1 ? `${layerY - size / 2}px` : 'auto');
    this.#setRippleVar(ripple, 'height', `${size}px`);
    this.#setRippleVar(ripple, 'width', `${size}px`);
    ripple.classList.add(rippleStyleClass.ending);

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
