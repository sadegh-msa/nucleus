export interface NuBrandLogoModel {
  path: string;
  height: number;
  width: number;
}

export interface NuBrandModel {
  title: string;
  homePage: string;
  logo: {
    noTitle: NuBrandLogoModel;
    hTitle: NuBrandLogoModel;
    vTitle: NuBrandLogoModel;
  };
}

export interface NuBrandingConfigModel {
  manufacturer: NuBrandModel;
  organization: NuBrandModel;
}
