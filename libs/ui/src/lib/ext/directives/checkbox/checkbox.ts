import {
  booleanAttribute,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  Renderer2,
  untracked,
} from '@angular/core';
import { getCheckmarkSvg } from '../../../int/constants';
import { uiStyleClass, uiStyleVar } from '../../../int/constants/html-constant';

const checkboxStyleClass = uiStyleClass.checkbox;

@Directive({
  selector: 'input[type="checkbox"][uiCheckbox]',
  host: {
    '[class]': 'styleClass',
    '(click)': 'onClickEvent()',
  },
})
export class UiCheckbox {
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);

  readonly styleClass = checkboxStyleClass.basic;

  checked = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      const checked = this.checked();
      untracked(() => this.#setCssVariable(checked));
    });
  }

  #setCssVariable(checked?: boolean) {
    const checkboxElement = this.#elementRef.nativeElement as HTMLInputElement;

    if (checked !== undefined) {
      checkboxElement.checked = checked;
    }

    const checkmarkValue = checkboxElement.checked
      ? `url('data:image/svg+xml, ${getCheckmarkSvg()}')`
      : 'none';
    const cssVariable = `${uiStyleVar.checkmark}: ${checkmarkValue};`;

    this.#renderer.setAttribute(checkboxElement, 'style', cssVariable);
  }

  onClickEvent() {
    this.#setCssVariable();
  }
}
