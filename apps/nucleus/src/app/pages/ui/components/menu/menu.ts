import { Component } from '@angular/core';
import { type MenuItemModel, MenuItems } from '@nucleus/ui';
import { navMainMenu } from '../../../../app.menu';

@Component({
  selector: 'app-menu',
  imports: [MenuItems],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  readonly compactMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
  readonly floatingMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
  readonly slidingMenuItems = structuredClone(navMainMenu) as MenuItemModel[];
}
