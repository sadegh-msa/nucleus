import { makeEnvironmentProviders } from '@angular/core';
import type { UiConfig } from '../models';
import { provideUiConfig } from './index';

export function provideUi(config: UiConfig) {
  return makeEnvironmentProviders([provideUiConfig(config)]);
}
