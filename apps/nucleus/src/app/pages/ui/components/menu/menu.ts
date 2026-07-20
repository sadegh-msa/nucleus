import { Component } from '@angular/core';
import { UiMenuItems, type UiMenuItemModel } from '@nucleus/ui';
import { navMainMenu } from '../../../../app.menu';

@Component({
  selector: 'app-menu',
  imports: [UiMenuItems],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  readonly compactMenuItems = structuredClone(navMainMenu) as UiMenuItemModel[];
  readonly floatingMenuItems = structuredClone(navMainMenu) as UiMenuItemModel[];
  readonly slidingMenuItems = structuredClone(navMainMenu) as UiMenuItemModel[];
}
