import type { NuBrandingConfig } from './branding-config.model';

export interface NuCommonConfig {
  rest: {
    url: string;
  },
  branding: NuBrandingConfig
}
