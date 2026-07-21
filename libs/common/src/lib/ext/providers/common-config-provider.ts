import { InjectionToken, inject } from '@angular/core';
import type { NuCommonConfigModel } from '../models/common-config.model';

const NU_COMMON_CONFIG = new InjectionToken<NuCommonConfigModel>('nu.common.config');

export function provideNuCommonConfig(config: NuCommonConfigModel) {
  return {
    provide: NU_COMMON_CONFIG,
    useValue: config,
  };
}

export function injectNuCommonConfig(): NuCommonConfigModel {
  return inject(NU_COMMON_CONFIG);
}
