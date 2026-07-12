import { InjectionToken, inject } from '@angular/core';
import type { NuCommonConfig } from '../models/common-config.model';

const NU_COMMON_CONFIG = new InjectionToken<NuCommonConfig>('nu.common.config');

export function provideNuCommonConfig(config: NuCommonConfig) {
  return {
    provide: NU_COMMON_CONFIG,
    useValue: config,
  };
}

export function injectNuCommonConfig(): NuCommonConfig {
  return inject(NU_COMMON_CONFIG);
}
