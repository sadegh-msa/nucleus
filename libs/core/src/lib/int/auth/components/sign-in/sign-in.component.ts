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
  FormFieldComponent,
  InputPasswordDirective,
  SvgIconDirective,
} from '@nucleus/ui';
import { authDefaultConfig } from '../../../../ext/auth/auth-default.config';
import type { AuthSignInModel, AuthSignInFormModel } from '../../../../ext/auth/models/auth.model';
import { injectAuthStore } from '../../../../ext/auth/store/auth.store';
import { SignLayoutComponent } from '../sign-layout/sign-layout.component';

@Component({
  selector: 'nu-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    ReactiveFormsModule,
    SignLayoutComponent,
    RouterLink,
    FormsModule,
    FormFieldComponent,
    CheckboxDirective,
    InputPasswordDirective,
    SvgIconDirective,
  ],
})
export class SignInComponent {
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
