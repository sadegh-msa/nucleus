import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { OperationStatus } from '@nucleus/common';
import { CheckboxDirective, FormFieldComponent, InputPasswordDirective } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';
import { authDefaultConfig } from '../../auth-default.config';
import { AuthSignIn, AuthSignInForm } from '../../models/auth.model';
import { authActions, authSelectors, AuthStates } from '../../store';
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
    SvgIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #authStore$ = inject(Store<AuthStates>);

  readonly config = authDefaultConfig;
  readonly form: FormGroup<AuthSignInForm> = new FormGroup<AuthSignInForm>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    rememberMe: new FormControl({ value: false, disabled: false }),
  });

  readonly isSubmitting = signal(false);

  ngOnInit() {
    this.#handleEvents();
  }

  #handleEvents() {
    this.#authStore$
      .pipe(select(authSelectors.signIn.status), takeUntilDestroyed(this.#destroyRef))
      .subscribe((status) => this.isSubmitting.set(status === OperationStatus.InProgress));
  }

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.#authStore$.dispatch(authActions.signIn({ request: this.form.value as AuthSignIn }));
  }
}
