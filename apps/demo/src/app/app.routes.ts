import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'button',
    title: $localize`Button`,
    loadComponent: () =>
      import('./blocks/components').then((m) => m.ButtonComponent),
  },
  {
    path: 'typography',
    title: $localize`Typography`,
    loadComponent: () =>
      import('./blocks/components').then((m) => m.TypographyComponent),
  },
  {
    path: 'icon',
    title: $localize`Icon`,
    loadComponent: () =>
      import('./blocks/components').then((m) => m.IconComponent),
  },
];
