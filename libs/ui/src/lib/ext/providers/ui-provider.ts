import { makeEnvironmentProviders } from '@angular/core';
import type { UiConfigModel } from '../models';
import { provideUiConfig } from './ui-config-provider';

export function provideUi(config: UiConfigModel) {
  return makeEnvironmentProviders([provideUiConfig(config)]);
}
