import { makeEnvironmentProviders } from '@angular/core';
import type { NuPanelConfig } from '../models/panel-config.model';
import { provideNuPanelConfig } from '../../internal/providers/panel-config.provider';

export function provideNuPanel(config: NuPanelConfig) {
  return makeEnvironmentProviders([provideNuPanelConfig(config)]);
}
