import { makeEnvironmentProviders } from '@angular/core';
import type { AuthConfig } from '../models/auth-config.model';
import { provideNuAuthConfig } from './auth-config.provider';
import { provideNuAuthInterceptor } from './auth-interceptor.provide';

export function provideNuAuth(config: AuthConfig) {
  return makeEnvironmentProviders([
    // provideRouter(authRoutes),
    provideNuAuthConfig(config),
    provideNuAuthInterceptor(),
  ]);
}
