import { Directive, ElementRef, inject, type OnInit, Renderer2 } from '@angular/core';
import { getCheckmarkSvg } from '../../../int/constants';
import { uiStyleClass, uiStyleVar } from '../../../int/constants/html-constant';

const checkboxStyleClass = uiStyleClass.checkbox;

@Directive({
  selector: 'input[type="checkbox"][uiCheckbox]',
  host: {
    '[class]': 'styleClass',
    '(click)': 'handleClickEvent()',
  },
})
export class UiCheckbox implements OnInit {
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);

  readonly styleClass = checkboxStyleClass.basic;

  ngOnInit() {
    this.#setCssVariable();
  }

  #setCssVariable() {
    const checkboxElement = this.#elementRef.nativeElement as HTMLInputElement;
    const checkmarkValue = checkboxElement.checked ? `url('data:image/svg+xml, ${getCheckmarkSvg()}')` : 'none';
    const cssVariable = `${uiStyleVar.checkmark}: ${checkmarkValue};`;

    this.#renderer.setAttribute(checkboxElement, 'style', cssVariable);
  }

  handleClickEvent() {
    this.#setCssVariable();
  }
}
