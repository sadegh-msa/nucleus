import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import { InputPasswordDirective, type PasswordStrength, SvgIconDirective } from '@nucleus/fabric';
import { type AuthStates, authActions, authSelectors } from '../../../../ext';
import { authDefaultConfig } from '../../../../ext/auth/auth-default.config';
import type { AuthSignIn, AuthSignUpForm } from '../../../../ext/auth/models/auth.model';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #authStore$ = inject(Store<AuthStates>);

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

  ngOnInit() {
    this.#handleEvents();
  }

  #handleEvents() {
    this.#authStore$
      .pipe(select(authSelectors.signUp.status), takeUntilDestroyed(this.#destroyRef))
      .subscribe((status) => this.isSubmitting.set(status === OperationStatus.InProgress));
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.#authStore$.dispatch(
      authActions.signUp({
        request: { ...this.form.value, confirmPassword: undefined } as AuthSignIn,
      }),
    );
  }

  onPasswordStrength(value: PasswordStrength) {
    console.log(value);
  }
}
