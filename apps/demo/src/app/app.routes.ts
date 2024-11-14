import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
