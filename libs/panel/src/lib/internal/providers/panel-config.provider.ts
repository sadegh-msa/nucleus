import { InjectionToken } from '@angular/core';
import { NuPanelConfig } from '../../external/models/panel-config.model';

export const NU_PANEL_CONFIG = new InjectionToken<NuPanelConfig>('nu.panel.config');

export function provideNuPanelConfig(config: NuPanelConfig) {
  return {
    provide: NU_PANEL_CONFIG,
    useValue: config,
  };
}
