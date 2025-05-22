import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreMessageService } from '../../store';
import { authSelectors, AuthStates } from '../store';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthEventHandlerService {
  readonly #storeMessageService = inject(StoreMessageService);
  readonly #authTokenService = inject(AuthTokenService);
  readonly #authStore$ = inject(Store<AuthStates>);

  constructor() {
    const callback = (event: Event) => {
      this.#authTokenService.extendTokenExpiry();
    };
    window.removeEventListener('beforeunload', callback);
    window.addEventListener('beforeunload', callback);
  }

  #handleEvents() {
    this.#authStore$
      .pipe(select(authSelectors.signIn.state))
      .subscribe((s) => this.#storeMessageService.failureObserver(s));

    this.#authStore$
      .pipe(select(authSelectors.signUp.state))
      .subscribe((s) => this.#storeMessageService.commonObserver(s));

    this.#authStore$
      .pipe(select(authSelectors.signOut.state))
      .subscribe((s) => this.#storeMessageService.failureObserver(s));
  }

  register() {
    this.#handleEvents();
    this.#authTokenService.extendTokenExpiry();
  }
}
