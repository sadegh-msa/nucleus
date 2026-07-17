import { InjectionToken, inject } from '@angular/core';
import type { NuL10nConfigModel } from '../models/l10n-config';

const NU_L10n_CONFIG = new InjectionToken<NuL10nConfigModel>('nu.l10n.config');

export function provideNuL10nConfig(config: NuL10nConfigModel) {
  return {
    provide: NU_L10n_CONFIG,
    useValue: config,
  };
}

export function injectNuL10nConfig(): NuL10nConfigModel {
  return inject(NU_L10n_CONFIG);
}
