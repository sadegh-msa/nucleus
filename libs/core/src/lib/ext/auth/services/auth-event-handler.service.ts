import { inject, Service } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreMessageService } from '../../store';
import { authSelectors, type AuthStates } from '../store';

@Service()
export class AuthEventHandlerService {
  readonly #storeMessageService = inject(StoreMessageService);
  readonly #authStore$ = inject(Store<AuthStates>);

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
  }
}
