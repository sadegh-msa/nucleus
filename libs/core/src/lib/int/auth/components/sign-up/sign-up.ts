import { Component, effect, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OperationStatus } from '@nucleus/common';
import {
  UiInputPassword,
  UiSvgIcon,
  type UiPasswordStrengthModel,
} from '@nucleus/ui';
import { authDefaultConfig } from '../../../../ext/auth/auth-default.config';
import type { AuthSignUpFormModel, AuthSignUpModel } from '../../../../ext/auth/models/auth.model';
import { injectAuthStore } from '../../../../ext/auth/store/auth-store';
import { SignLayout } from '../sign-layout/sign-layout';

@Component({
  selector: 'nu-sign-up',
  templateUrl: './sign-up.html',
  imports: [RouterLink, ReactiveFormsModule, SignLayout, UiInputPassword, UiSvgIcon],
})
export class SignUp {
  readonly #authStore = injectAuthStore();

  readonly config = authDefaultConfig;
  readonly form: FormGroup<AuthSignUpFormModel> = new FormGroup<AuthSignUpFormModel>({
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
    } as AuthSignUpModel);
  }

  onPasswordStrength(value: UiPasswordStrengthModel) {
    console.log(value);
  }
}
