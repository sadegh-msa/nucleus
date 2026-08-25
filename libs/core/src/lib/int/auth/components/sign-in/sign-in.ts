import { Component, effect, signal, untracked } from '@angular/core';
import { email, FormField, form, maxLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { UiCheckbox, UiFormField, UiInputPassword, UiSvgIcon } from '@nucleus/ui';
import type { AuthSignInModel } from '../../../../ext/auth/models/auth.model';
import { injectAuthStore } from '../../../../ext/auth/store/auth-store';
import { authInternalConfig } from '../../configs';
import { AuthLayout } from '../auth-layout/auth-layout';

@Component({
  selector: 'nu-sign-in',
  templateUrl: './sign-in.html',
  imports: [RouterLink, FormField, AuthLayout, UiFormField, UiCheckbox, UiInputPassword, UiSvgIcon],
})
export class SignIn {
  readonly #authStore = injectAuthStore();

  readonly config = authInternalConfig.entity;
  readonly formId = this.config.signIn.html.form.id;
  readonly authSignInModel = signal<AuthSignInModel>({
    email: '',
    password: '',
    rememberMe: false,
  });
  readonly form = form(this.authSignInModel, (f) => {
    required(f.email, { message: $localize`Required` });
    email(f.email, { message: $localize`Invalid` });
    required(f.password, { message: $localize`Required` });
    maxLength(f.password, 36, { message: $localize`Too long` });
  });
  readonly isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const status = this.#authStore.signInStatus();
      untracked(() => this.isSubmitting.set(status === 'inProgress'));
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const form = this.form();

    if (form.invalid() || this.isSubmitting()) {
      form.markAsTouched();
      return;
    }

    this.#authStore.signIn(form.value() as AuthSignInModel);
  }
}
