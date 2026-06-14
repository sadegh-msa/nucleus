import { Component } from '@angular/core';
import { type MenuItem, MenuItemsComponent } from '@nucleus/fabric';
import { navMainMenu } from '../../../../app.menu';

@Component({
  selector: 'app-menu',
  imports: [MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly compactMenuItems = structuredClone(navMainMenu) as MenuItem[];
  readonly floatingMenuItems = structuredClone(navMainMenu) as MenuItem[];
  readonly slidingMenuItems = structuredClone(navMainMenu) as MenuItem[];
}
