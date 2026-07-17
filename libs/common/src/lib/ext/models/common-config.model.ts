import type { NuBrandingConfigModel } from './branding-config.model';

export interface NuCommonConfigModel {
  api: {
    rest: {
      url: string;
      path: string;
      time: string;
    };
  };
  branding: NuBrandingConfigModel;
  links: Record<'customerAgreement' | 'privacyPolicy', string>;
  crypto: {
    algorithm: {
      name: 'AES-CTR' | 'AES-CBC' | 'AES-GCM';
      length: number;
    };
    secureKey: string;
  };
}
