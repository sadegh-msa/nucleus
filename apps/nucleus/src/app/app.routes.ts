import { Route } from '@angular/router';
import { authCanActivate } from '@nucleus/core';
import { sampleConfig, sampleRoutes } from './pages/sample';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [authCanActivate],
    loadComponent: () =>
      import('@nucleus/panel').then(({ components }) => components.NuPanelComponent),
    children: [
      {
        path: 'button',
        title: 'Button',
        loadComponent: () => import('./blocks/components').then((m) => m.ButtonComponent),
      },
      {
        path: 'icon',
        title: 'Icon',
        loadComponent: () => import('./blocks/components').then((m) => m.IconComponent),
      },
      {
        path: 'menu',
        title: 'Menu',
        loadComponent: () => import('./blocks/components').then((m) => m.MenuComponent),
      },
      {
        path: 'popover',
        title: 'Popover',
        loadComponent: () => import('./blocks/components').then((m) => m.PopoverComponent),
      },
      {
        path: 'typography',
        title: 'Typography',
        loadComponent: () => import('./blocks/components').then((m) => m.TypographyComponent),
      },
      {
        path: sampleConfig.path.base,
        canActivate: [authCanActivate],
        children: sampleRoutes,
      },
    ],
  },
];
