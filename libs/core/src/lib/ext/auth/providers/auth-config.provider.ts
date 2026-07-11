import { InjectionToken, inject } from '@angular/core';
import type { AuthConfig } from '../models/auth-config.model';

const NU_AUTH_CONFIG = new InjectionToken<AuthConfig>('nu.auth.config');

export function provideAuthConfig(config: AuthConfig) {
  return {
    provide: NU_AUTH_CONFIG,
    useValue: config,
  };
}

export function injectAuthConfig(): AuthConfig {
  return inject(NU_AUTH_CONFIG);
}
