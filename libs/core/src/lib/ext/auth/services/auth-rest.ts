import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { authInternalConfig } from '../../../int/auth/configs';
import { RestApi } from '../../crud/services/rest-api'; // Possibility of circular dependency
import type {
  AuthSignInModel,
  AuthSignInResponseModel,
  AuthSignUpModel,
  AuthSignUpResponseModel,
} from '../models/auth.model';

@Service()
export class AuthRest {
  readonly #httpClient = inject(HttpClient);
  readonly #restApi = inject(RestApi);

  readonly endpoint = authInternalConfig.rest.endpoint;

  createUrl(...paths: string[]) {
    return this.#restApi.createUrl(this.endpoint, ...paths);
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
    return this.#httpClient.post(this.createUrl('logout'), {});
  }

  refresh() {
    return this.#httpClient.post(this.createUrl('refresh'), {});
  }
}
