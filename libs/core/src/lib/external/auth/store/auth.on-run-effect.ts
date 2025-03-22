import { inject, Injectable } from '@angular/core';
import { authActions } from './auth.actions';
import { Actions, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { exhaustMap, Observable, takeUntil } from 'rxjs';

@Injectable()
export class AuthOnRunEffect implements OnRunEffects {
  readonly #actions$ = inject(Actions);

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.#actions$.pipe(
      ofType(authActions.checkSuccess),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.#actions$.pipe(ofType(authActions.checkFailure)))
        )
      )
    );
  }
}
