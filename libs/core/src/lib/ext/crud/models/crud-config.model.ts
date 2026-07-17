import type { PagePathModel } from './page.model';
import type { ActionPermissionModel } from './permission.model';

export interface CrudConfigModel<B, I extends keyof B, C extends keyof B, T extends keyof B> {
  info: {
    title: string;
    icon: string;
  };
  field: {
    id: B[I];
    code: B[C];
    title: B[T];
    dates: string[];
  };
  path: {
    base: string;
    full: string[];
    page: PagePathModel;
  };
  permission: {
    action: ActionPermissionModel;
  };
  rest: {
    endpoint: string;
  };
}
