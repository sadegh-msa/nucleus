import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import type { NuL10nConfig } from '../models/l10n-config';

export const NU_L10n_CONFIG = new InjectionToken<NuL10nConfig>('nu.l10n.config');

export function provideNuL10n(config: NuL10nConfig) {
  return makeEnvironmentProviders([
    {
      provide: NU_L10n_CONFIG,
      useValue: config,
    },
  ]);
}
