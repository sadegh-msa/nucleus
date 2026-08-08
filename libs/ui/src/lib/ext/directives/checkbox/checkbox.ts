import { Directive, ElementRef, inject, type OnInit, Renderer2 } from '@angular/core';
import { getCheckmarkSvg } from '../../../int/constants';
import { uiStyleClass, uiStyleVar } from '../../../int/constants/style-constant';

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
    const checkmarkSvgPath = `${uiStyleVar.checkmark}: url('data:image/svg+xml, ${getCheckmarkSvg()}');`;
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'style', checkmarkSvgPath);
  }

  handleClickEvent() {
    this.#setCssVariable();
  }
}
