import { ScrCommonConfig } from '../../common';
import { LayoutConfig } from '../../layout';

export interface AuthConfig extends Pick<ScrCommonConfig, 'rest'>, Pick<LayoutConfig, 'branding'> {
  rememberMeExpiry: number;
}
