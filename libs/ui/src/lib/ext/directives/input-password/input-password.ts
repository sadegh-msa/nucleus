import {
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  type OnInit,
  output,
  Renderer2,
  untracked,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { type PasswordStrengthModel, PasswordValidator } from '@nucleus/common';
import { uiStyleClass } from '../../../int/constants/html-constant';

const passwordStyleClass = uiStyleClass.password;

@Directive({
  selector: '[uiInputPassword]',
  host: {
    '[class]': 'styleClass',
  },
})
export class UiInputPassword implements OnInit {
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #formField = inject(FormField);
  readonly #passwordValidator = inject(PasswordValidator);

  readonly styleClass = passwordStyleClass.input.basic;

  passwordToConfirm = input<string | null>();

  strength = output<PasswordStrengthModel>();
  confirm = output<boolean>();

  constructor() {
    effect(() => {
      const password = this.#formField.state().controlValue();

      untracked(() => {
        this.strength.emit(this.#passwordValidator.check(password));
        this.confirm.emit(this.passwordToConfirm() === password);
      });
    });
  }

  ngOnInit() {
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'type', 'password');
  }
}
