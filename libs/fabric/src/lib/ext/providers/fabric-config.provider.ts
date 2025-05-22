import { InjectionToken } from '@angular/core';
import type { FabricConfig } from '../models';

export const FABRIC_CONFIG = new InjectionToken<FabricConfig>('fabric.config');

export function provideFabricConfig(config: FabricConfig) {
  return {
    provide: FABRIC_CONFIG,
    useValue: config,
  };
}
