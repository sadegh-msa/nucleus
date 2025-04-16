import { Directive, ElementRef, HostBinding, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[type="checkbox"][fabCheckbox]',
})
export class CheckboxDirective {
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);

  @HostBinding('class') styleClass = ['fab', 'checkbox'];

  @HostListener('click', ['$event.target'])
  handleClickEvent() {
    this.#renderer.setAttribute(
      this.#elementRef.nativeElement,
      'style',
      `--checkmark-svg-path: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="oklch(94% 0.015 250deg)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="a${Math.random()}"><style> %23check-first, %23check-second { height: 0; animation-timing-function: ease-in-out; animation-duration: 150ms; animation-direction: normal; animation-fill-mode: both; } %23check-first { transform: rotate(-45deg); animation-name: firstAnimation; } %23check-second { transform: rotate(-135deg); animation-name: secondAnimation; animation-delay: 150ms; } @keyframes firstAnimation { 0% { height: 0; } 100% { height: 34%; } } @keyframes secondAnimation { 0% { height: 0; } 100% { height: 67%; } } </style><rect x="-27%" y="49%" width="1%" height="34%" id="check-first" /><rect x="-84%" y="-27%" width="1%" height="67%" id="check-second" /></svg>');`,
    );
  }
}
