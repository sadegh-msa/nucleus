import { Component, effect, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OperationStatus } from '@nucleus/common';
import { InputPasswordDirective, type PasswordStrength, SvgIconDirective } from '@nucleus/fabric';
import { authDefaultConfig } from '../../../../ext/auth/auth-default.config';
import type { AuthSignUp, AuthSignUpForm } from '../../../../ext/auth/models/auth.model';
import { injectAuthStore } from '../../../../ext/auth/store/auth.store';
import { SignLayoutComponent } from '../sign-layout/sign-layout.component';

@Component({
  selector: 'nu-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignLayoutComponent,
    InputPasswordDirective,
    SvgIconDirective,
  ],
})
export class SignUpComponent {
  readonly #authStore = injectAuthStore();

  readonly config = authDefaultConfig;
  readonly form: FormGroup<AuthSignUpForm> = new FormGroup<AuthSignUpForm>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    confirmPassword: new FormControl(null, [Validators.required]),
  });

  readonly isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const status = this.#authStore.signUpStatus();

      untracked(() => {
        this.isSubmitting.set(status === OperationStatus.InProgress);
      });
    });
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.#authStore.signUp({
      ...this.form.value,
      confirmPassword: undefined,
    } as AuthSignUp);
  }

  onPasswordStrength(value: PasswordStrength) {
    console.log(value);
  }
}
