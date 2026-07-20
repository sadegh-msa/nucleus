import { Component, effect, signal, untracked } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OperationStatus } from '@nucleus/common';
import {
  CheckboxDirective,
  FormField,
  InputPasswordDirective,
  SvgIconDirective,
} from '@nucleus/ui';
import { authDefaultConfig } from '../../../../ext/auth/auth-default.config';
import type { AuthSignInFormModel, AuthSignInModel } from '../../../../ext/auth/models/auth.model';
import { injectAuthStore } from '../../../../ext/auth/store/auth.store';
import { SignLayout } from '../sign-layout/sign-layout';

@Component({
  selector: 'nu-sign-in',
  templateUrl: './sign-in.html',
  imports: [
    ReactiveFormsModule,
    SignLayout,
    RouterLink,
    FormsModule,
    FormField,
    CheckboxDirective,
    InputPasswordDirective,
    SvgIconDirective,
  ],
})
export class SignIn {
  readonly #authStore = injectAuthStore();

  readonly config = authDefaultConfig;
  readonly form: FormGroup<AuthSignInFormModel> = new FormGroup<AuthSignInFormModel>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    rememberMe: new FormControl({ value: false, disabled: false }),
  });

  readonly isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const status = this.#authStore.signInStatus();

      untracked(() => {
        this.isSubmitting.set(status === OperationStatus.InProgress);
      });
    });
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.#authStore.signIn(this.form.value as AuthSignInModel);
  }
}
