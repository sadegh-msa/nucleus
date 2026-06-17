import type { MenuItem } from '@nucleus/fabric';

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
        id: 'nucleus-nav-link-libs-fabric',
        label: 'Fabric',
        icon: 'main-component',
        permission: 'nucleus.libs.fabric',
        expanded: false,
        children: [
          {
            id: 'nucleus-nav-link-button',
            label: 'Button',
            icon: 'mouse-square',
            routerLink: '/fabric/button',
            permission: 'nucleus.button',
          },
          {
            id: 'nucleus-nav-link-icon',
            label: 'Icon',
            icon: 'shapes',
            routerLink: '/fabric/icon',
            permission: 'nucleus.icon',
          },
          {
            id: 'nucleus-nav-link-menu',
            label: 'Menu',
            icon: 'menu-1',
            routerLink: '/fabric/menu',
            permission: 'nucleus.menu',
          },
          {
            id: 'nucleus-nav-link-popover',
            label: 'Popover',
            icon: 'message',
            routerLink: '/fabric/popover',
            permission: 'nucleus.popover',
          },
          {
            id: 'nucleus-nav-link-typography',
            label: 'Typography',
            icon: 'text',
            routerLink: '/fabric/typography',
            permission: 'nucleus.typography',
          },
        ],
      },
    ],
  },
] as MenuItem[];
