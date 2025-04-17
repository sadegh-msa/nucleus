import { makeEnvironmentProviders } from '@angular/core';
import type { NuPanelConfig } from '../models/panel-config.model';
import { provideNuPanelConfig } from '../../int/providers/panel-config.provider';

export function provideNuPanel(config: NuPanelConfig) {
  return makeEnvironmentProviders([provideNuPanelConfig(config)]);
}
