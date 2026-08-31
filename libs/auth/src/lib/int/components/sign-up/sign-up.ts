import { Component, computed, effect, signal, untracked } from '@angular/core';
import { email, FormField, form, maxLength, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import type { PasswordStrengthModel } from '@nucleus/common';
import {
  UiFormField,
  UiInputPassword,
  UiPasswordChecklist,
  UiPopover,
  UiSvgIcon,
} from '@nucleus/ui';
import type { AuthSignUpModel } from '../../../ext/models/auth.model';
import { injectAuthStore } from '../../../ext/store/auth-store';
import { authInternalConfig } from '../../configs';
import { AuthLayout } from '../auth-layout/auth-layout';

@Component({
  selector: 'nu-sign-up',
  templateUrl: './sign-up.html',
  imports: [
    RouterLink,
    FormField,
    AuthLayout,
    UiFormField,
    UiInputPassword,
    UiSvgIcon,
    UiPopover,
    UiPasswordChecklist,
  ],
})
export class SignUp {
  readonly #authStore = injectAuthStore();

  readonly config = authInternalConfig.entity;
  readonly formId = this.config.signUp.html.form.id;
  readonly authSignInModel = signal<AuthSignUpModel & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  readonly form = form(this.authSignInModel, (f) => {
    required(f.email, { message: $localize`Required` });
    email(f.email, { message: $localize`Invalid` });
    required(f.password, { message: $localize`Required` });
    maxLength(f.password, 36, { message: $localize`Too long` });
    validate(f.password, () => {
      const { moderate, strong } = this.passwordStrength() ?? {};
      if (!moderate && !strong) {
        return { kind: 'strength', message: $localize`Weak` };
      }
      return undefined;
    });
    required(f.confirmPassword, { message: $localize`Required` });
    validate(f.confirmPassword, () => {
      if (!this.arePasswordsMatching()) {
        return { kind: 'match', message: $localize`Mismatch` };
      }
      return undefined;
    });
  });
  readonly passwordStrength = signal<PasswordStrengthModel | null>(null);
  readonly arePasswordsMatching = signal(false);
  readonly isSubmitting = signal(false);

  readonly passwordHint = computed(() => {
    const { moderate, strong } = this.passwordStrength() ?? {};

    let message = '';
    let styleClass = '';

    if (strong) {
      message = $localize`Strong`;
      styleClass = 'success';
    } else if (moderate) {
      message = $localize`Moderate`;
      styleClass = 'warning';
    }

    return {
      message,
      ...(message && styleClass && { styleClass: `ui text ${styleClass}` }),
    };
  });

  readonly confirmPasswordHint = computed(() => {
    if (
      this.form.password().value() &&
      this.form.confirmPassword().value() &&
      this.arePasswordsMatching()
    ) {
      return {
        message: $localize`Match`,
        styleClass: 'ui text success',
      };
    }

    return undefined;
  });

  constructor() {
    effect(() => {
      const status = this.#authStore.signUpStatus();
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

    this.#authStore.signUp({
      ...form.value(),
      confirmPassword: undefined,
    } as AuthSignUpModel);
  }
}
