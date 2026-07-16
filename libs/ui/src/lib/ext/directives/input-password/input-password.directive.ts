import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnInit,
  output,
  Renderer2,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { map } from 'rxjs';
import type { PasswordStrength } from '../../models';

@Directive({
  selector: '[uiInputPassword]',
  host: {
    'class': 'ui input password',
  },
})
export class InputPasswordDirective implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #ngControl = inject(NgControl);

  mediumPattern = input(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  );
  strongPattern = input(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
  passwordToConfirm = input<string | null>();

  strength = output<PasswordStrength>();

  ngOnInit() {
    this.#handleEvents();
    this.#setElementAttributes();
  }

  #setElementAttributes() {
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'type', 'password');
  }

  #handleEvents() {
    const formControl = this.#ngControl.control;

    if (!formControl) {
      return;
    }

    formControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      map(String)
    ).subscribe((value) => {
      this.strength.emit({
        medium: this.mediumPattern().test(value),
        strong: this.strongPattern().test(value)
      });

      if (this.passwordToConfirm()) {
        formControl.setErrors({ passwordsDoNotMatch: value !== this.passwordToConfirm() });
      }
    });
  }
}
