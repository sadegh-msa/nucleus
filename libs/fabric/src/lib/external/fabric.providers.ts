import {
  popperVariation,
  provideTippyConfig,
  tooltipVariation,
} from '@ngneat/helipopper';

export const fabricProviders = [
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
];
