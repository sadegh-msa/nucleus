import { makeEnvironmentProviders } from '@angular/core';
import type { NuL10nConfigModel } from '../models/l10n-config';
import { provideNuL10nConfig } from './l10n-config.provider';

export function provideNuL10n(config: NuL10nConfigModel) {
  return makeEnvironmentProviders([provideNuL10nConfig(config)]);
}
