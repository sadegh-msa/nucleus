import type { PagePath } from './page.model';
import type { ActionPermission } from './permission.model';

export interface CrudConfig<B, I extends keyof B, C extends keyof B, T extends keyof B> {
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
    page: PagePath;
  };
  permission: {
    action: ActionPermission;
  };
  rest: {
    endpoint: string;
  };
}
