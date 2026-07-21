import { InjectionToken, inject } from '@angular/core';
import type { UiConfigModel } from '../models';

const UI_CONFIG = new InjectionToken<UiConfigModel>('ui.config');

export function provideUiConfig(config: UiConfigModel) {
  return {
    provide: UI_CONFIG,
    useValue: config,
  };
}

export function injectUiConfig(): UiConfigModel {
  return inject(UI_CONFIG);
}
