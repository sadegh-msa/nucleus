import type { UiMenuItemModel } from '@nucleus/ui';

export const navMainMenu = [
  {
    id: 'nucleus-nav-link-libs',
    label: 'Libraries',
    icon: 'code-1',
    permission: 'nucleus.libs',
    expanded: false,
    children: [
      {
        id: 'nucleus-nav-link-libs-crud',
        label: 'CRUD',
        icon: 'document-code',
        permission: 'nucleus.libs.crud',
        expanded: false,
        children: [
          {
            id: 'nucleus-nav-link-sample-list',
            label: 'Sample list',
            icon: 'grid-1',
            routerLink: '/crud/sample/list',
            permission: 'nucleus.sample.list',
          },
        ],
      },
      {
        id: 'nucleus-nav-link-libs-ui',
        label: 'UI',
        icon: 'main-component',
        permission: 'nucleus.libs.ui',
        expanded: false,
        children: [
          {
            id: 'nucleus-nav-link-button',
            label: 'Button',
            icon: 'mouse-square',
            routerLink: '/ui/button',
            permission: 'nucleus.button',
          },
          {
            id: 'nucleus-nav-link-icon',
            label: 'Icon',
            icon: 'shapes',
            routerLink: '/ui/icon',
            permission: 'nucleus.icon',
          },
          {
            id: 'nucleus-nav-link-menu',
            label: 'Menu',
            icon: 'menu-1',
            routerLink: '/ui/menu',
            permission: 'nucleus.menu',
          },
          {
            id: 'nucleus-nav-link-popover',
            label: 'Popover',
            icon: 'message',
            routerLink: '/ui/popover',
            permission: 'nucleus.popover',
          },
          {
            id: 'nucleus-nav-link-typography',
            label: 'Typography',
            icon: 'text',
            routerLink: '/ui/typography',
            permission: 'nucleus.typography',
          },
        ],
      },
    ],
  },
] as UiMenuItemModel[];
