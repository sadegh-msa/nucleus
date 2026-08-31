import { InjectionToken, inject } from '@angular/core';
import type { AuthConfigModel } from '../models/auth-config.model';

const NU_AUTH_CONFIG = new InjectionToken<AuthConfigModel>('nu.auth.config');

export function provideAuthConfig(config: AuthConfigModel) {
  return {
    provide: NU_AUTH_CONFIG,
    useValue: config,
  };
}

export function injectAuthConfig(): AuthConfigModel {
  return inject(NU_AUTH_CONFIG);
}
