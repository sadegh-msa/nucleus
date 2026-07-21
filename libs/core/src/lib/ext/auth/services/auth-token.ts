import { computed, effect, inject, resource, Service, untracked } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { CookieUtils, OperationStatus, PermanentStorage, sleepRandom } from '@nucleus/common';
import { debounceTime, filter, fromEvent, map, skipWhile } from 'rxjs';
import { authDefaultConfig } from '../auth-default.config';
import { injectAuthConfig } from '../providers/auth-config-provider';
import { injectAuthStore } from '../store/auth-store';

@Service()
export class AuthToken {
  readonly #router = inject(Router);
  readonly #cookieUtils = inject(CookieUtils);
  readonly #permanentStorage = inject(PermanentStorage);
  readonly #authStore = injectAuthStore();
  readonly #authConfig = injectAuthConfig();

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

    // Watch check status
    effect(() => {
      const status = this.#authStore.checkStatus();
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

    // Watch signIn state
    effect(() => {
      const { status, response } = this.#authStore.signInState();
      if (status === Success) {
        untracked(() => this.#handleSignInSuccess(response.token.accessToken));
      } else if (status === Failure) {
        untracked(() => this.#handleAuthFailure());
      }
    });

    // Watch signUp state
    effect(() => {
      const { status, response } = this.#authStore.signUpState();
      if (status === Success) {
        untracked(() => this.#handleSignUpSuccess(response.token.accessToken));
      } else if (status === Failure) {
        untracked(() => this.#handleAuthFailure());
      }
    });

    // Watch signOut state
    effect(() => {
      const { status } = this.#authStore.signOutState();
      if (status === Success) {
        untracked(() => this.#handleSignOutSuccess());
      }
    });
  }

  async #handleSignInSuccess(accessToken: string | null) {
    await this.setAccessToken(accessToken);
    this.#redirectToApp(true);
    await this.#checkToken();
  }

  async #handleSignUpSuccess(accessToken: string | null) {
    await this.setAccessToken(accessToken);
    this.#redirectToApp();
    await this.#checkToken();
  }

  async #handleSignOutSuccess() {
    this.#storeRequestedUrl('');
    await this.deleteAccessToken();
    await this.#checkToken();
  }

  async #handleAuthFailure() {
    await this.deleteAccessToken();
    await this.#checkToken();
  }

  #storeRequestedUrl(url: string) {
    this.#permanentStorage.setItem(this.#REQUESTED_URL_KEY, url);
  }

  #restoreRequestedUrl() {
    return this.#permanentStorage.getItem(this.#REQUESTED_URL_KEY) || '';
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
    return (await this.#cookieUtils.getItem(this.#COOKIE_ACCESS_TOKEN_KEY)) || null;
  }

  async #checkToken() {
    const isAuthenticated = await this.isAuthenticated();

    if (isAuthenticated) {
      this.#authStore.checkSuccess();
    } else {
      this.#authStore.checkFailure();
    }
  }

  async setAccessToken(accessToken: string | null) {
    await this.#cookieUtils.setItem(
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
    await this.#cookieUtils.deleteItem(this.#COOKIE_ACCESS_TOKEN_KEY);
    this.#reloadAccessToken();
  }

  isAuthRouteActivated(url: string) {
    const path = url.split('/')?.at(-1)?.split('#')[0];
    return !!path && this.#AUTH_PATHS.includes(path);
  }
}
