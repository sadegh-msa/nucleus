import { MenuItem } from 'primeng/api';

export interface LayoutConfigLogo {
  path: string;
  height: number;
  width: number;
}

export interface LayoutConfigBrand {
  title: string;
  homePage: string;
  logo: {
    noTitle: LayoutConfigLogo;
    hTitle: LayoutConfigLogo;
    vTitle: LayoutConfigLogo;
  };
}

export interface LayoutConfigBranding {
  manufacturer: LayoutConfigBrand;
  organization: LayoutConfigBrand;
}

export interface LayoutConfig {
  branding: LayoutConfigBranding;
  navMenuItems: MenuItem[];
}
