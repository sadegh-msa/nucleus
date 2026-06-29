import { inject, Service } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationStatus } from '@nucleus/common';
import { MessageService } from '@nucleus/fabric';
import { catchError, map, mergeMap, of } from 'rxjs';
import { formatErrorMessage } from '../../crud/helpers/format-messages.helper'; // Possibility of circular dependency
import { AuthRestService } from '../services/auth-rest.service';
import { authActions } from './auth.actions';

@Service({ autoProvided: false })
export class AuthEffects {
  readonly #actions$ = inject(Actions);
  readonly #authRestService = inject(AuthRestService);
  readonly #messageService = inject(MessageService);

  signIn$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(authActions.signIn),
      mergeMap(({ request }) =>
        this.#authRestService.signIn(request).pipe(
          map((response) =>
            authActions.signInSuccess({
              response,
              message: $localize`You signed in successfully`,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            this.#messageService.addError(message);

            return of(
              authActions.signInFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
        ),
      ),
    ),
  );

  signUp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(authActions.signUp),
      mergeMap(({ request }) =>
        this.#authRestService.signUp(request).pipe(
          map((response) => {
            const message = $localize`You signed up successfully`;
            this.#messageService.addSuccess(message);

            return authActions.signUpSuccess({
              response,
              message,
              status: OperationStatus.Success,
            });
          }),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            this.#messageService.addError(message);

            return of(
              authActions.signUpFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
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
              message: $localize`You signed out successfully`,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            this.#messageService.addError(message);

            return of(
              authActions.signOutFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
        ),
      ),
    ),
  );
}
