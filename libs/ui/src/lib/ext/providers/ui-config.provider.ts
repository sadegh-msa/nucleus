import { InjectionToken, inject } from '@angular/core';
import type { UiConfig } from '../models';

const UI_CONFIG = new InjectionToken<UiConfig>('ui.config');

export function provideUiConfig(config: UiConfig) {
  return {
    provide: UI_CONFIG,
    useValue: config,
  };
}

export function injectUiConfig(): UiConfig {
  return inject(UI_CONFIG);
}
