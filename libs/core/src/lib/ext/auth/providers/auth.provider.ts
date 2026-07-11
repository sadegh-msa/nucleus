import { makeEnvironmentProviders } from '@angular/core';
import type { AuthConfig } from '../models/auth-config.model';
import { provideAuthConfig } from './auth-config.provider';
import { provideAuthInterceptor } from './auth-interceptor.provide';

export function provideAuth(config: AuthConfig) {
  return makeEnvironmentProviders([
    // provideRouter(authRoutes),
    provideAuthConfig(config),
    provideAuthInterceptor(),
  ]);
}
