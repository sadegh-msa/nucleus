import { Route } from '@angular/router';

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
    ],
  },
];
