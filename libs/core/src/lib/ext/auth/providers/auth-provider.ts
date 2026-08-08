import { makeEnvironmentProviders } from '@angular/core';
import type { AuthConfigModel } from '../models/auth-config.model';
import { provideAuthConfig } from './auth-config-provider';
import { provideAuthInterceptor } from './auth-interceptor.provide';

export function provideAuth(config: AuthConfigModel) {
  return makeEnvironmentProviders([provideAuthConfig(config), provideAuthInterceptor()]);
}
