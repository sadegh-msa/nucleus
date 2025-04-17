export interface NuBrandLogo {
  path: string;
  height: number;
  width: number;
}

export interface NuBrand {
  title: string;
  homePage: string;
  logo: {
    noTitle: NuBrandLogo;
    hTitle: NuBrandLogo;
    vTitle: NuBrandLogo;
  };
}

export interface NuBrandingConfig {
  manufacturer: NuBrand;
  organization: NuBrand;
}
