import { makeEnvironmentProviders } from '@angular/core';
import {
  popperVariation,
  provideTippyConfig,
  provideTippyLoader,
  tooltipVariation
} from '@ngneat/helipopper/config';
import type { FabricConfig } from '../models';
import { provideFabricConfig } from './index';

export function provideFabric(config: FabricConfig) {
  return makeEnvironmentProviders([
    provideFabricConfig(config),
    provideTippyLoader(() => import('tippy.js')),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: {
          ...tooltipVariation,
          arrow: true,
          animation: 'fade',
        },
        popper: {
          ...popperVariation,
          arrow: false,
          animation: 'fade',
          offset: [0, 0]
        }
      }
    }),
  ]);
}
