import { InjectionToken } from '@angular/core';
import type { NuCommonConfig } from '../models/common-config.model';

export const NU_COMMON_CONFIG = new InjectionToken<NuCommonConfig>('nu.common.config');

export function provideNuCommonConfig(config: NuCommonConfig) {
  return {
    provide: NU_COMMON_CONFIG,
    useValue: config,
  };
}
