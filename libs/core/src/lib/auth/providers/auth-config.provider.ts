import { InjectionToken } from '@angular/core';
import { AuthConfig } from '../models/auth-config.model';

export const SCR_AUTH_CONFIG = new InjectionToken<AuthConfig>('scr.auth.config');

export function authConfigProvider(config: AuthConfig) {
  return {
    provide: SCR_AUTH_CONFIG,
    useValue: config
  };
}

