import { InjectionToken, inject } from '@angular/core';
import type { FabricConfig } from '../models';

const FABRIC_CONFIG = new InjectionToken<FabricConfig>('fabric.config');

export function provideFabricConfig(config: FabricConfig) {
  return {
    provide: FABRIC_CONFIG,
    useValue: config,
  };
}

export function injectFabricConfig(): FabricConfig {
  return inject(FABRIC_CONFIG);
}
