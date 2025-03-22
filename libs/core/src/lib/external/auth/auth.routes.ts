import { Route } from '@angular/router';
import { authDefaultConfig } from './auth-default.config';
import { authCanActivateSelf } from './guards/auth-self.guard';

export const authRoutes: Route[] = [
  {
    path: authDefaultConfig.path.signIn,
    canActivate: [authCanActivateSelf],
    loadComponent: () =>
      import('./components/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: authDefaultConfig.path.signUp,
    canActivate: [authCanActivateSelf],
    loadComponent: () =>
      import('./components/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
];
