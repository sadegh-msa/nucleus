import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { InputPasswordDirective, PasswordStrength, StyleClassDirective } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';
import { OperationStatus } from '../../../common';
import { authDefaultConfig } from '../../auth-default.config';
import { AuthSignIn, AuthSignUpForm } from '../../models/auth.model';
import { authActions, authSelectors, AuthStates } from '../../store';
import { SignLayoutComponent } from '../sign-layout/sign-layout.component';

@Component({

  selector: 'nu-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignLayoutComponent,
    InputPasswordDirective,
    StyleClassDirective,
    SvgIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #authStore$ = inject(Store<AuthStates>);

  readonly config = authDefaultConfig;
  readonly form: FormGroup<AuthSignUpForm> = new FormGroup<AuthSignUpForm>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    confirmPassword: new FormControl(null, [Validators.required])
  });

  readonly isSubmitting = signal(false);

  ngOnInit() {
    this.#handleEvents();
  }

  #handleEvents() {
    this.#authStore$.pipe(
      select(authSelectors.signUp.status),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(status => this.isSubmitting.set(status === OperationStatus.InProgress));
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.#authStore$.dispatch(authActions.signUp({
      request: { ...this.form.value, confirmPassword: undefined } as AuthSignIn
    }));
  }

  onPasswordStrength(value: PasswordStrength) {
    console.log(value);
  }
}
