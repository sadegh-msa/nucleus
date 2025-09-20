import { makeEnvironmentProviders } from '@angular/core';
import type { FabricConfig } from '../models';
import { provideFabricConfig } from './index';

export function provideFabric(config: FabricConfig) {
  return makeEnvironmentProviders([provideFabricConfig(config)]);
}
