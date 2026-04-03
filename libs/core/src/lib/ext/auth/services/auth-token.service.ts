import { computed, effect, Injectable, inject, resource } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
  CookieService,
  OperationStatus,
  PermanentStorageService, sleepRandom
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

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  readonly #router = inject(Router);
  readonly #cookieService = inject(CookieService);
  readonly #permanentStorageService = inject(PermanentStorageService);
  readonly #authStore$ = inject(Store<AuthStates>);
  readonly #authConfig = inject(NU_AUTH_CONFIG);

  readonly #COOKIE_ACCESS_TOKEN_KEY = 'aat';
  readonly #LAST_URL_KEY = 'lastUrl';
  readonly #REMEMBER_ME_EXPIRY_MINUTES = this.#authConfig.rememberMeExpiry || 7 * 24 * 60;
  readonly #DEADLINE_EXTENDER_TIME = 60 * 1000;
  readonly #AUTH_PATHS = Object.values(authDefaultConfig.routes).map((i) => i.path);

  readonly #accessTokenResource = resource({
    loader: () => this.#fetchAccessToken(),
    defaultValue: OperationStatus.Initial,
  });
  readonly isAuthenticated = computed(async () => !!(await this.getAccessToken()));

  #lastUrlApplied = false;

  constructor() {
    this.#handleEvents();
    this.#settleAccessTokenDeadlineExtender();

    effect(() => this.#checkToken());
  }

  #handleEvents() {
    const { Success, Failure } = OperationStatus;
    this.#lastUrlApplied = false;

    this.#router.events
      .pipe(
        filter((v) => v instanceof NavigationEnd),
        map((v) => v as NavigationEnd),
      )
      .subscribe((route) => {
        if (!this.isAuthRouteActivated(route.url)) {
          this.#storeLastUrl(route.url);
        }
      });

    this.#authStore$
      .pipe(select(authSelectors.check.status), debounceTime(1), distinctUntilChanged())
      .subscribe((status) => {
        if (status === Success) {
          this.#redirectToApp(!this.isAuthRouteActivated(this.#restoreLastUrl()));
        } else if (status === Failure) {
          if (!this.isAuthRouteActivated(location.pathname)) {
            this.#redirectToApp(false, ['/', authDefaultConfig.routes.signIn.path]);
          }
        }
      });

    this.#authStore$
      .pipe(select(authSelectors.signIn.state), debounceTime(1), distinctUntilKeyChanged('status'))
      .subscribe(async ({ status, request, response }) => {
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
        this.#storeLastUrl('');
        await this.deleteAccessToken();
        await this.#checkToken();
      });
  }

  #storeLastUrl(url: string) {
    this.#permanentStorageService.setItem(this.#LAST_URL_KEY, url);
  }

  #restoreLastUrl() {
    return this.#permanentStorageService.getItem(this.#LAST_URL_KEY) || '/';
  }

  #redirectToApp(toLastUrl = false, path = ['/']) {
    if (toLastUrl && !this.#lastUrlApplied) {
      path.splice(0, path.length);
      path.push(this.#restoreLastUrl());
    }

    this.#router
      .navigate(path)
      .then(() => {
        this.#lastUrlApplied = toLastUrl;
      })
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
