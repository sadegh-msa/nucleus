import type { Route } from '@angular/router';
import { authCanActivateSelf } from '../../int/auth/guards/auth-self.guard';
import { authDefaultConfig } from './auth-default.config';

const routesInfo = authDefaultConfig.routes;

export const authRoutes: Route[] = [
  {
    path: routesInfo.signIn.path,
    title: routesInfo.signIn.title,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignInComponent),
  },
  {
    path: routesInfo.signUp.path,
    title: routesInfo.signUp.title,
    canActivate: [authCanActivateSelf],
    loadComponent: () => import('../../int/auth/components').then((m) => m.SignUpComponent),
  },
];
