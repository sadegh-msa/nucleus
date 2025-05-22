import type { Route } from '@angular/router';
import { authCanActivate, authRoutes } from '@nucleus/core';
import { sampleConfig, sampleRoutes } from './pages/sample';

export const appRoutes: Route[] = [
  ...authRoutes,
  {
    path: 'button',
    title: 'Button',
    canActivate: [authCanActivate],
    loadComponent: () => import('./blocks/components').then((m) => m.ButtonComponent),
  },
  {
    path: 'icon',
    title: 'Icon',
    canActivate: [authCanActivate],
    loadComponent: () => import('./blocks/components').then((m) => m.IconComponent),
  },
  {
    path: 'menu',
    title: 'Menu',
    canActivate: [authCanActivate],
    loadComponent: () => import('./blocks/components').then((m) => m.MenuComponent),
  },
  {
    path: 'popover',
    title: 'Popover',
    canActivate: [authCanActivate],
    loadComponent: () => import('./blocks/components').then((m) => m.PopoverComponent),
  },
  {
    path: 'typography',
    title: 'Typography',
    canActivate: [authCanActivate],
    loadComponent: () => import('./blocks/components').then((m) => m.TypographyComponent),
  },
  {
    path: sampleConfig.path.base,
    canActivate: [authCanActivate],
    children: sampleRoutes,
  },
  { path: '**', pathMatch: 'full', redirectTo: 'button' },
];
