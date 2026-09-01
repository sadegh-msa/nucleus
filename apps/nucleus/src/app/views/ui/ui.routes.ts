import type { Route } from '@angular/router';

export const uiRoutes: Route[] = [
  {
    path: 'button',
    title: 'Button',
    loadComponent: () => import('./components').then((m) => m.Button),
  },
  {
    path: 'icon',
    title: 'Icon',
    loadComponent: () => import('./components').then((m) => m.Icon),
  },
  {
    path: 'menu',
    title: 'Menu',
    loadComponent: () => import('./components').then((m) => m.Menu),
  },
  {
    path: 'popover',
    title: 'Popover',
    loadComponent: () => import('./components').then((m) => m.Popover),
  },
  {
    path: 'typography',
    title: 'Typography',
    loadComponent: () => import('./components').then((m) => m.Typography),
  },
];
