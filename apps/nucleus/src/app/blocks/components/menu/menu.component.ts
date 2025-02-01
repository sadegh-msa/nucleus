import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem, MenuItemsComponent } from '@nucleus/fabric';
import { appMenuItems } from '../../../app.menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly compactMenuItems = structuredClone(appMenuItems) as MenuItem[];
  readonly floatingMenuItems = structuredClone(appMenuItems) as MenuItem[];
  readonly slidingMenuItems = structuredClone(appMenuItems) as MenuItem[];
}
