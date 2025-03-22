import { makeEnvironmentProviders } from '@angular/core';
import type { LayoutConfig } from '../models/layout-config.model';
import { provideNuLayoutConfig } from './layout-config.provider';

export function provideNuLayout(config: LayoutConfig) {
  return makeEnvironmentProviders([provideNuLayoutConfig(config)]);
}
