import type { Route } from '@angular/router';
import { authInternalConfig } from '../../int/auth/configs';
import { authCanActivateSelf } from '../../int/auth/guards';

const signInConfig = authInternalConfig.entity.signIn;
const signUpConfig = authInternalConfig.entity.signUp;

export const authRoutes: Route[] = [
  {
    ...signInConfig.route,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignIn),
  },
  {
    ...signUpConfig.route,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignUp),
  },
];
