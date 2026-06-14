import { inject, Service } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationStatus } from '@nucleus/common';
import { catchError, map, mergeMap, of } from 'rxjs';
import { formatErrorMessage } from '../../crud';
import { AuthRestService } from '../services/auth-rest.service';
import { authActions } from './auth.actions';

@Service({ autoProvided: false })
export class AuthEffects {
  readonly #actions$ = inject(Actions);
  readonly #authRestService = inject(AuthRestService);

  signIn$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(authActions.signIn),
      mergeMap(({ request }) =>
        this.#authRestService.signIn(request).pipe(
          map((response) =>
            authActions.signInSuccess({
              response,
              message: 'You signed in successfully',
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              authActions.signInFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  signUp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(authActions.signUp),
      mergeMap(({ request }) =>
        this.#authRestService.signUp(request).pipe(
          map((response) =>
            authActions.signUpSuccess({
              response,
              message: 'You signed up successfully',
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              authActions.signUpFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  signOut$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(authActions.signOut),
      mergeMap(() =>
        this.#authRestService.signOut().pipe(
          map(() =>
            authActions.signOutSuccess({
              message: 'You signed out successfully',
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              authActions.signOutFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
