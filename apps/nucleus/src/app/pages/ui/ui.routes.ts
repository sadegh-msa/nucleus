import type { Route } from '@angular/router';


export const uiRoutes: Route[] = [
  {
    path: 'button',
    title: 'Button',
    loadComponent: () => import('./components').then((m) => m.ButtonComponent),
  },
  {
    path: 'icon',
    title: 'Icon',
    loadComponent: () => import('./components').then((m) => m.IconComponent),
  },
  {
    path: 'menu',
    title: 'Menu',
    loadComponent: () => import('./components').then((m) => m.MenuComponent),
  },
  {
    path: 'popover',
    title: 'Popover',
    loadComponent: () => import('./components').then((m) => m.PopoverComponent),
  },
  {
    path: 'typography',
    title: 'Typography',
    loadComponent: () => import('./components').then((m) => m.TypographyComponent),
  },

];
