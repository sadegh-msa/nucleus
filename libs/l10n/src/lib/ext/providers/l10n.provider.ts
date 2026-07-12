import { makeEnvironmentProviders } from '@angular/core';
import type { NuL10nConfig } from '../models/l10n-config';
import { provideNuL10nConfig } from './l10n-config.provider';

export function provideNuL10n(config: NuL10nConfig) {
  return makeEnvironmentProviders([provideNuL10nConfig(config)]);
}
