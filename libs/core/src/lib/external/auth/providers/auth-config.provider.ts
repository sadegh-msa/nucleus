import { InjectionToken } from '@angular/core';
import { AuthConfig } from '../models/auth-config.model';

export const NU_AUTH_CONFIG = new InjectionToken<AuthConfig>('nu.auth.config');

export function provideNuAuthConfig(config: AuthConfig) {
  return {
    provide: NU_AUTH_CONFIG,
    useValue: config
  };
}

