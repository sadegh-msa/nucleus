import type { UiMenuItemModel } from '@nucleus/ui';

export const navMainMenu = [
  {
    id: 'nucleus-nav-link-libs',
    label: 'Libraries',
    icon: 'code-square',
    permission: 'nucleus.libs',
    expanded: false,
    children: [
      {
        id: 'nucleus-nav-link-libs-crud',
        label: 'CRUD',
        icon: 'sheet',
        permission: 'nucleus.libs.crud',
        expanded: false,
        children: [
          {
            id: 'nucleus-nav-link-sample-list',
            label: 'Sample list',
            icon: 'pipette',
            routerLink: '/crud/sample/list',
            permission: 'nucleus.sample.list',
          },
        ],
      },
      {
        id: 'nucleus-nav-link-libs-ui',
        label: 'UI',
        icon: 'blocks',
        permission: 'nucleus.libs.ui',
        expanded: false,
        children: [
          {
            id: 'nucleus-nav-link-button',
            label: 'Button',
            icon: 'cursor-square',
            routerLink: '/ui/button',
            permission: 'nucleus.button',
          },
          {
            id: 'nucleus-nav-link-icon',
            label: 'Icon',
            icon: 'mask-sad',
            routerLink: '/ui/icon',
            permission: 'nucleus.icon',
          },
          {
            id: 'nucleus-nav-link-menu',
            label: 'Menu',
            icon: 'hamburger-menu',
            routerLink: '/ui/menu',
            permission: 'nucleus.menu',
          },
          {
            id: 'nucleus-nav-link-popover',
            label: 'Popover',
            icon: 'chat-square-line',
            routerLink: '/ui/popover',
            permission: 'nucleus.popover',
          },
          {
            id: 'nucleus-nav-link-typography',
            label: 'Typography',
            icon: 'text-format',
            routerLink: '/ui/typography',
            permission: 'nucleus.typography',
          },
        ],
      },
    ],
  },
] as UiMenuItemModel[];
