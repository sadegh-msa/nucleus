import type { Route } from '@angular/router';
import { authCanActivate, authRoutes } from '@nucleus/core/auth';
import { sampleConfig, sampleRoutes } from './pages/crud/sample';
import { uiRoutes } from './pages/ui/ui.routes';

export const appRoutes: Route[] = [
  ...authRoutes,
  {
    path: sampleConfig.path.base,
    canActivate: [authCanActivate],
    children: sampleRoutes,
  },
  {
    path: 'ui',
    canActivate: [authCanActivate],
    children: uiRoutes,
  },
  { path: '**', pathMatch: 'full', redirectTo: 'ui/button' },
];
