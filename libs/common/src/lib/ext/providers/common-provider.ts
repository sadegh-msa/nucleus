import { makeEnvironmentProviders } from '@angular/core';
import type { NuCommonConfigModel } from '../models/common-config.model';
import { provideNuCommonConfig } from './common-config-provider';

export function provideNuCommon(config: NuCommonConfigModel) {
  return makeEnvironmentProviders([provideNuCommonConfig(config)]);
}
