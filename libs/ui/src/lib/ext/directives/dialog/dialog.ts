import { Directive, ElementRef, effect, inject, input, untracked } from '@angular/core';
import { uiStyleClass } from '../../../int/constants';

const dialogStyleClass = uiStyleClass.dialog;

@Directive({
  selector: 'dialog[uiDialog]',
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiDialog {
  readonly #elementRef = inject(ElementRef);

  visible = input(false, { alias: 'uiDialog' });
  styleClass = input(dialogStyleClass.basic, { alias: 'uiDialogStyleClass' });

  constructor() {
    effect(() => {
      const visible = this.visible();
      const dialogElement = this.#elementRef.nativeElement;

      untracked(() => {
        if (visible) {
          dialogElement.showModal();
        } else {
          dialogElement.close();
        }
      });
    });
  }
}
