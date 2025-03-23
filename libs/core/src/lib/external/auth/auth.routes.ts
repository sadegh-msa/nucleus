import { Route } from '@angular/router';
import { authDefaultConfig } from './auth-default.config';
import { authCanActivateSelf } from './guards/auth-self.guard';

export const authRoutes: Route[] = [
  {
    path: '',
    canActivate: [authCanActivateSelf],
    canActivateChild: [authCanActivateSelf],
    loadComponent: () => import('./components/auth/auth.component').then((m) => m.AuthComponent),
    children: [
      {
        path: authDefaultConfig.path.signIn,
        loadComponent: () =>
          import('./components/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: authDefaultConfig.path.signUp,
        loadComponent: () =>
          import('./components/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      },
    ],
  },
];
