import { NuCommonConfig } from '../../common';
import { LayoutConfig } from '../../layout';

export interface AuthConfig extends Pick<NuCommonConfig, 'rest'>, Pick<LayoutConfig, 'branding'> {
  rememberMeExpiry: number;
}
