import { InjectionToken, inject } from '@angular/core';
import type { NuL10nConfig } from '../models/l10n-config';

const NU_L10n_CONFIG = new InjectionToken<NuL10nConfig>('nu.l10n.config');

export function provideNuL10nConfig(config: NuL10nConfig) {
  return {
    provide: NU_L10n_CONFIG,
    useValue: config,
  };
}

export function injectNuL10nConfig(): NuL10nConfig {
  return inject(NU_L10n_CONFIG);
}
