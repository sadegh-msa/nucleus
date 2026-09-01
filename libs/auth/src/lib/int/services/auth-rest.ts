import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import { map } from 'rxjs';
import type {
  AuthSignInModel,
  AuthSignInResponseModel,
  AuthSignUpModel,
  AuthSignUpResponseModel,
} from '../../ext/models/auth.model';
import { authInternalConfig } from '../../int/configs';

@Service()
export class AuthRest {
  readonly #httpClient = inject(HttpClient);
  readonly #commonConfig = injectNuCommonConfig();

  readonly endpoint = authInternalConfig.rest.endpoint;

  createUrl(...paths: string[]) {
    return [this.#commonConfig.api.rest.url, this.endpoint, ...paths].filter((p) => !!p).join('/');
  }

  signIn(data: AuthSignInModel) {
    return this.#httpClient
      .post(this.createUrl('signin'), data)
      .pipe(map((v) => ({ token: v }) as AuthSignInResponseModel));
  }

  signUp(data: AuthSignUpModel) {
    return this.#httpClient
      .post(this.createUrl('signup'), data)
      .pipe(map((v) => ({ token: v }) as AuthSignUpResponseModel));
  }

  signOut() {
    return this.#httpClient.post(this.createUrl('signout'), {});
  }

  refresh() {
    return this.#httpClient.post(this.createUrl('refresh'), {});
  }
}
