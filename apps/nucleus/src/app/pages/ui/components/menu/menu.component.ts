import { Component } from '@angular/core';
import { type MenuItemModel, MenuItemsComponent } from '@nucleus/ui';
import { navMainMenu } from '../../../../app.menu';

@Component({
  selector: 'app-menu',
  imports: [MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly compactMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
  readonly floatingMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
  readonly slidingMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
}
