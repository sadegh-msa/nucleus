import { Route } from '@angular/router';
import { authCanActivateChild } from '@nucleus/core';
import { sampleConfig, sampleRoutes } from './pages/sample';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@nucleus/panel').then(({ components }) => components.NuPanelComponent),
    children: [
      {
        path: 'button',
        title: $localize`Button`,
        loadComponent: () => import('./blocks/components').then((m) => m.ButtonComponent),
      },
      {
        path: 'icon',
        title: $localize`Icon`,
        loadComponent: () => import('./blocks/components').then((m) => m.IconComponent),
      },
      {
        path: 'menu',
        title: $localize`Menu`,
        loadComponent: () => import('./blocks/components').then((m) => m.MenuComponent),
      },
      {
        path: 'typography',
        title: $localize`Typography`,
        loadComponent: () => import('./blocks/components').then((m) => m.TypographyComponent),
      },
      {
        path: sampleConfig.path.base, canActivateChild: [authCanActivateChild], children: sampleRoutes
      }
    ],
  },
];
