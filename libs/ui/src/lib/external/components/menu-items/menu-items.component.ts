import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TippyDirective } from '@ngneat/helipopper';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItem } from '../../models';

type TooltipPlacement = NonNullable<MenuItem['tooltipPlacement']>;

@Component({
  selector: 'menu[uiMenuItems]',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SvgIconComponent,
    TippyDirective,
    NgStyle,
    NgClass,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-items.component.html',
})
export class MenuItemsComponent {
  items = input.required<MenuItem[]>({ alias: 'uiMenuItems' });
  setStyleClass = input(true, { alias: 'uiMenuSetStyleClass' });
  tooltipPlacement = input<TooltipPlacement>('auto-end', {
    alias: 'uiMenuTooltipPlacement',
  });
  mode = input<'compact' | 'wide'>('wide', { alias: 'uiMenuMode' });
  submenuMode = input<'floating' | 'sliding'>('floating', {
    alias: 'uiMenuSubmenuMode',
  });

  readonly isCompact = computed(() => this.mode() === 'compact');
  readonly isWide = computed(() => this.mode() === 'wide');

  @HostBinding('class')
  get styleClass() {
    return [
      this.setStyleClass() ? 'ui menu' : '',
      this.mode(),
      this.isCompact() ? 'floating' : this.submenuMode(),
    ].join(' ');
  }

  constructor() {
    effect(() => {
      this.items()
        .filter((i) => i.expanded)
        .forEach((item) => this.calculateSize(item));
    });
  }

  calculateSize(item: MenuItem) {
    if (!item.expanded) {
      return 0;
    }

    item.size = 0;
    item.children?.forEach((i) => (item.size! += this.calculateSize(i) + 1));

    return item.size;
  }

  collapseItem(item: MenuItem) {
    item.children?.forEach((i) => this.collapseItem(i));
    item.expanded = false;
  }

  clickItem(item: MenuItem) {
    const submenuMode = this.submenuMode();

    if (item.children?.length) {
      item.expanded = submenuMode === 'floating' || !item.expanded;

      if (!item.expanded) {
        this.collapseItem(item);
      }
    } else if (submenuMode === 'floating') {
      this.items().forEach((i) => this.collapseItem(i));
    }

    if (submenuMode === 'sliding') {
      this.items().forEach((i) => this.calculateSize(i));
    }

    if (item.command) {
      item.command(item);
    }
  }

  pointerdownItem(item: MenuItem) {
    if (this.submenuMode() === 'floating') {
      if (!item.children?.length) {
        item.expanded = false;
      }
    }
  }

  pointerenterItem(item: MenuItem, liElement: HTMLLIElement) {
    if (this.submenuMode() === 'floating') {
      this.placeSubmenu(liElement);
      item.expanded = true;
    }
  }

  pointerleaveItem(item: MenuItem, liElement: HTMLLIElement) {
    if (this.submenuMode() === 'floating') {
      item.expanded = false;
      this.resetSubmenuPlacement(liElement);
    }
  }

  placeSubmenu(liElement: HTMLLIElement) {
    const menuElements = liElement.getElementsByTagName('menu');
    const menuElement = menuElements[0];

    if (menuElement) {
      const rect = menuElement.getBoundingClientRect();
      const heightDiff = window.innerHeight - (rect.y + rect.height);
      const margin = 12;
      const top = heightDiff <= margin ? Math.abs(heightDiff) + margin : 0;

      menuElement.style['top'] = `-${top}px`;
    }
  }

  resetSubmenuPlacement(liElement: HTMLLIElement) {
    const menuElements = liElement.getElementsByTagName('menu');
    const elementsLength = menuElements.length;

    for (let i = 0; i < elementsLength; i++) {
      const menuElement = menuElements[i];
      menuElement.style['top'] = `0`;
    }
  }
}
