import { computed, effect, inject, resource, Service } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
  CookieService,
  OperationStatus,
  PermanentStorageService,
  sleepRandom,
} from '@nucleus/common';
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  fromEvent,
  map,
  skipWhile,
} from 'rxjs';
import { authDefaultConfig } from '../auth-default.config';
import { NU_AUTH_CONFIG } from '../providers/auth-config.provider';
import { type AuthStates, authActions, authSelectors } from '../store';

@Service()
export class AuthTokenService {
  readonly #router = inject(Router);
  readonly #cookieService = inject(CookieService);
  readonly #permanentStorageService = inject(PermanentStorageService);
  readonly #authStore$ = inject(Store<AuthStates>);
  readonly #authConfig = inject(NU_AUTH_CONFIG);

  readonly #COOKIE_ACCESS_TOKEN_KEY = 'aat';
  readonly #REQUESTED_URL_KEY = 'requestedUrl';
  readonly #REMEMBER_ME_EXPIRY_MINUTES = this.#authConfig.rememberMeExpiry || 7 * 24 * 60;
  readonly #DEADLINE_EXTENDER_TIME = 60 * 1000;
  readonly #AUTH_PATHS = Object.values(authDefaultConfig.routes).map((i) => i.path);

  readonly #accessTokenResource = resource({
    loader: () => this.#fetchAccessToken(),
    defaultValue: OperationStatus.Initial,
  });
  readonly isAuthenticated = computed(async () => !!(await this.getAccessToken()));

  constructor() {
    this.#handleEvents();
    this.#settleAccessTokenDeadlineExtender();

    effect(() => this.#checkToken());
  }

  #handleEvents() {
    const { Success, Failure } = OperationStatus;

    this.#router.events
      .pipe(
        filter((v) => v instanceof NavigationCancel),
        map((v) => v as NavigationCancel),
      )
      .subscribe(async (route) => {
        if (!(await this.isAuthenticated()) && !this.isAuthRouteActivated(route.url)) {
          this.#storeRequestedUrl(route.url);
        }
      });

    this.#authStore$
      .pipe(select(authSelectors.check.status), debounceTime(1), distinctUntilChanged())
      .subscribe((status) => {
        if (status === Success) {
          const requestedUrl = this.#restoreRequestedUrl();

          if (requestedUrl) {
            this.#redirectToApp(!this.isAuthRouteActivated(requestedUrl));
          }
        } else if (status === Failure) {
          if (!this.isAuthRouteActivated(location.pathname)) {
            this.#redirectToApp(false, ['/', authDefaultConfig.routes.signIn.path]);
          }
        }
      });

    this.#authStore$
      .pipe(select(authSelectors.signIn.state), debounceTime(1), distinctUntilKeyChanged('status'))
      .subscribe(async ({ status, response }) => {
        if (status === Success) {
          await this.setAccessToken(response.token.accessToken);
          this.#redirectToApp(true);
        } else if (status === Failure) {
          await this.deleteAccessToken();
        }

        await this.#checkToken();
      });

    this.#authStore$
      .pipe(select(authSelectors.signUp.state), debounceTime(1), distinctUntilKeyChanged('status'))
      .subscribe(async ({ status, response }) => {
        if (status === Success) {
          await this.setAccessToken(response.token.accessToken);
          this.#redirectToApp();
        } else if (status === Failure) {
          await this.deleteAccessToken();
        }

        await this.#checkToken();
      });

    this.#authStore$
      .pipe(
        select(authSelectors.signOut.state),
        debounceTime(1),
        distinctUntilKeyChanged('status'),
        filter((s) => s.status === Success),
      )
      .subscribe(async () => {
        this.#storeRequestedUrl('');
        await this.deleteAccessToken();
        await this.#checkToken();
      });
  }

  #storeRequestedUrl(url: string) {
    this.#permanentStorageService.setItem(this.#REQUESTED_URL_KEY, url);
  }

  #restoreRequestedUrl() {
    return this.#permanentStorageService.getItem(this.#REQUESTED_URL_KEY) || '';
  }

  #redirectToApp(loadRequestedUrl = false, path = ['/']) {
    const requestedUrl = this.#restoreRequestedUrl();

    if (loadRequestedUrl && requestedUrl) {
      path.splice(0, path.length);
      path.push(requestedUrl);
      this.#storeRequestedUrl('');
    }

    this.#router
      .navigate(path)
      .then()
      .catch(() => this.#router.navigate(['/']).then());
  }

  #settleAccessTokenDeadlineExtender() {
    fromEvent(document, 'click')
      .pipe(
        skipWhile(() => !this.isAuthenticated()),
        debounceTime(this.#DEADLINE_EXTENDER_TIME),
      )
      .subscribe(async () => {
        await this.setAccessToken((await this.getAccessToken()) || null);
      });
  }

  #reloadAccessToken() {
    return this.#accessTokenResource.reload();
  }

  async #fetchAccessToken() {
    return (await this.#cookieService.getItem(this.#COOKIE_ACCESS_TOKEN_KEY)) || null;
  }

  async #checkToken() {
    const isAuthenticated = await this.isAuthenticated();

    this.#authStore$.dispatch(
      isAuthenticated ? authActions.checkSuccess() : authActions.checkFailure(),
    );
  }

  async setAccessToken(accessToken: string | null) {
    await this.#cookieService.setItem(
      this.#COOKIE_ACCESS_TOKEN_KEY,
      accessToken,
      this.#REMEMBER_ME_EXPIRY_MINUTES,
    );
    this.#reloadAccessToken();
  }

  async getAccessToken() {
    let accessToken = this.#accessTokenResource.value();

    while (accessToken === OperationStatus.Initial) {
      accessToken = this.#accessTokenResource.value();
      await sleepRandom();
    }

    return accessToken;
  }

  async deleteAccessToken() {
    await this.#cookieService.deleteItem(this.#COOKIE_ACCESS_TOKEN_KEY);
    this.#reloadAccessToken();
  }

  isAuthRouteActivated(url: string) {
    const path = url.split('/')?.at(-1)?.split('#')[0];
    return !!path && this.#AUTH_PATHS.includes(path);
  }
}
