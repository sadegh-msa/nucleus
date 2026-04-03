import type { Route } from '@angular/router';
import { authCanActivate, authRoutes } from '@nucleus/core';
import { sampleConfig, sampleRoutes } from './pages/crud/sample';
import { fabricRoutes } from './pages/fabric/fabric.routes';

export const appRoutes: Route[] = [
  ...authRoutes,
  {
    path: sampleConfig.path.base,
    canActivate: [authCanActivate],
    children: sampleRoutes,
  },
  {
    path: 'fabric',
    canActivate: [authCanActivate],
    children: fabricRoutes,
  },
  { path: '**', pathMatch: 'full', redirectTo: 'fabric/button' },
];
