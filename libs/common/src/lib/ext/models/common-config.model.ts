import type { NuBrandingConfig } from './branding-config.model';

export interface NuCommonConfig {
  api: {
    rest: {
      url: string;
      path: string;
      time: string;
    };
  };
  branding: NuBrandingConfig;
  links: Record<'customerAgreement' | 'privacyPolicy', string>;
  crypto: {
    algorithm: {
      name: 'AES-CTR' | 'AES-CBC' | 'AES-GCM';
      length: number;
    };
    secureKey: string;
  };
}
