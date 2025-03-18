import { MenuItem } from 'primeng/api';

export const navMenuItems: MenuItem[] = [
  {
    id: self.crypto.randomUUID(),
    label: 'Sample',
    icon: 'pi pi-fw pi-server',
    items: [
      {
        id: self.crypto.randomUUID(),
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            id: self.crypto.randomUUID(),
            label: 'Bookmark',
            icon: 'pi pi-fw pi-bookmark'
          },
          {
            id: self.crypto.randomUUID(),
            label: 'Video',
            icon: 'pi pi-fw pi-video'
          }
        ]
      },
      {
        id: self.crypto.randomUUID(),
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      },
      {
        id: self.crypto.randomUUID(),
        label: 'Export',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  }
];
