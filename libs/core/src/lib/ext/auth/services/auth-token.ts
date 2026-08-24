import { computed, effect, inject, resource, Service, untracked } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { CookieManager, PermanentStorage, sleepRandom } from '@nucleus/common';
import { debounceTime, filter, fromEvent, map, skipWhile } from 'rxjs';
import { authInternalConfig } from '../../../int/auth/configs';
import { injectAuthConfig } from '../providers/auth-config-provider';
import { injectAuthStore } from '../store/auth-store';

const entityConfig = authInternalConfig.entity;
const tokenConfig = authInternalConfig.token;

@Service()
export class AuthToken {
  readonly #router = inject(Router);
  readonly #cookieManager = inject(CookieManager);
  readonly #permanentStorage = inject(PermanentStorage);
  readonly #authStore = injectAuthStore();
  readonly #authConfig = injectAuthConfig();

  readonly #authPaths = Object.values(entityConfig).map((i) => i.route.path);

  readonly #accessTokenResource = resource({
    loader: () => this.#fetchAccessToken(),
    defaultValue: 'initial',
  });
  readonly isAuthenticated = computed(async () => !!(await this.getAccessToken()));

  constructor() {
    this.#handleEvents();
    this.#settleAccessTokenDeadlineExtender();

    effect(() => this.#checkToken());
  }

  #handleEvents() {
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

    effect(() => {
      const status = this.#authStore.checkStatus();

      untracked(() => {
        if (status === 'success') {
          const requestedUrl = this.#restoreRequestedUrl();

          if (requestedUrl) {
            this.#redirectToApp(!this.isAuthRouteActivated(requestedUrl));
          }
        } else if (status === 'failure') {
          if (!this.isAuthRouteActivated(location.pathname)) {
            this.#redirectToApp(false, ['/', entityConfig.signIn.route.path]);
          }
        }
      });
    });

    effect(() => {
      const { status, response } = this.#authStore.signInState();

      untracked(() => {
        if (status === 'success') {
          this.#handleSignInSuccess(response.token.accessToken);
        } else if (status === 'failure') {
          this.#handleAuthFailure();
        }
      });
    });

    effect(() => {
      const { status, response } = this.#authStore.signUpState();

      untracked(() => {
        if (status === 'success') {
          this.#handleSignUpSuccess(response.token.accessToken);
        } else if (status === 'failure') {
          this.#handleAuthFailure();
        }
      });
    });

    effect(() => {
      const { status } = this.#authStore.signOutState();

      untracked(() => {
        if (status === 'success') {
          this.#handleSignOutSuccess();
        }
      });
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
    this.#permanentStorage.setItem(tokenConfig.requestedUrlKey, url);
  }

  #restoreRequestedUrl() {
    return this.#permanentStorage.getItem(tokenConfig.requestedUrlKey) || '';
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
        debounceTime(tokenConfig.deadlineExtenderTime),
      )
      .subscribe(async () => {
        await this.setAccessToken((await this.getAccessToken()) || null);
      });
  }

  #reloadAccessToken() {
    return this.#accessTokenResource.reload();
  }

  async #fetchAccessToken() {
    return (await this.#cookieManager.getItem(tokenConfig.cookieAccessTokenKey)) || null;
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
    await this.#cookieManager.setItem(
      tokenConfig.cookieAccessTokenKey,
      accessToken,
      this.#authConfig.rememberMeExpiry,
    );
    await this.#reloadAccessToken();
  }

  async getAccessToken() {
    let accessToken = this.#accessTokenResource.value();

    while (accessToken === 'initial') {
      accessToken = this.#accessTokenResource.value();
      await sleepRandom();
    }

    return accessToken;
  }

  async deleteAccessToken() {
    await this.#cookieManager.deleteItem(tokenConfig.cookieAccessTokenKey);
    await this.#reloadAccessToken();
  }

  isAuthRouteActivated(url: string) {
    const path = url.split('/')?.at(-1)?.split('#')[0];
    return !!path && this.#authPaths.includes(path);
  }
}
