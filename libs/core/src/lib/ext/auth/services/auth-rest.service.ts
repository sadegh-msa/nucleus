import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { RestApiService } from '../../crud/services/rest-api.service'; // Possibility of circular dependency
import { authDefaultConfig } from '../auth-default.config';
import type {
  AuthSignInModel,
  AuthSignInResponseModel,
  AuthSignUpModel,
  AuthSignUpResponseModel
} from '../models/auth.model';

@Service()
export class AuthRestService {
  readonly #httpClient = inject(HttpClient);
  readonly #restApiService = inject(RestApiService);

  readonly endpoint = authDefaultConfig.rest.endpoint;

  createUrl(...paths: string[]) {
    return this.#restApiService.createUrl(this.endpoint, ...paths);
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
    return this.#httpClient.post(this.createUrl('logout'), {});
  }
}
