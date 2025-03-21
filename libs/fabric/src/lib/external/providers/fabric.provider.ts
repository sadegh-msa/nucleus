import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { popperVariation, provideTippyConfig, tooltipVariation } from '@ngneat/helipopper';
import { FabricConfig } from '../models';
import { provideFabricConfig } from './index';
import { IconService } from '../services';

export function provideFabric(config: FabricConfig) {
  return makeEnvironmentProviders([
    provideFabricConfig(config),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: {
          ...tooltipVariation,
          animation: 'fade',
          arrow: true,
        },
        popper: popperVariation,
      },
    }),
    provideAppInitializer(() => {
      const iconService = inject(IconService);

      iconService.loadIcons();
    }),
  ]);
}
