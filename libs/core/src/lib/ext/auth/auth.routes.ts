import type { Route } from '@angular/router';
import { authInternalConfig } from '../../int/auth/configs';
import { authCanActivateSelf } from '../../int/auth/guards';

const routesConfig = authInternalConfig.routes;

export const authRoutes: Route[] = [
  {
    path: routesConfig.signIn.path,
    title: routesConfig.signIn.title,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignIn),
  },
  {
    path: routesConfig.signUp.path,
    title: routesConfig.signUp.title,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignUp),
  },
];
