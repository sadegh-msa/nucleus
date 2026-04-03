import { Injectable, inject } from '@angular/core';
import { Actions, type EffectNotification, type OnRunEffects, ofType } from '@ngrx/effects';
import { exhaustMap, type Observable, takeUntil } from 'rxjs';
import { authActions } from './auth.actions';

@Injectable()
export class AuthOnRunEffect implements OnRunEffects {
  readonly #actions$ = inject(Actions);

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.#actions$.pipe(
      ofType(authActions.checkSuccess),
      exhaustMap(() =>
        resolvedEffects$.pipe(takeUntil(this.#actions$.pipe(ofType(authActions.checkFailure)))),
      ),
    );
  }
}
