import { makeEnvironmentProviders } from '@angular/core';
import type { NuCommonConfig } from '../models/common-config.model';
import { provideNuCommonConfig } from './common-config.provider';

export function provideNuCommon(config: NuCommonConfig) {
  return makeEnvironmentProviders([provideNuCommonConfig(config)]);
}
