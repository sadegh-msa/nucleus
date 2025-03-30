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
  selector: 'menu[fabMenuItems]',
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
  items = input.required<MenuItem[]>({ alias: 'fabMenuItems' });
  setStyleClass = input(true, { alias: 'fabMenuSetStyleClass' });
  tooltipPlacement = input<TooltipPlacement>('auto-end', {
    alias: 'fabMenuTooltipPlacement',
  });
  mode = input<'compact' | 'wide'>('wide', { alias: 'fabMenuMode' });
  submenuMode = input<'floating' | 'sliding'>('floating', {
    alias: 'fabMenuSubmenuMode',
  });

  readonly isCompact = computed(() => this.mode() === 'compact');
  readonly isWide = computed(() => this.mode() === 'wide');

  @HostBinding('class')
  get styleClass() {
    return [
      this.setStyleClass() ? 'fab menu' : '',
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

  onPointerDownItem(item: MenuItem) {
    if (this.submenuMode() === 'floating') {
      if (!item.children?.length) {
        item.expanded = false;
      }
    }
  }

  onPointerEnterItem(item: MenuItem, liElement: HTMLLIElement) {
    if (this.submenuMode() === 'floating') {
      this.placeSubmenu(liElement);
      item.expanded = true;
    }
  }

  onPointerLeaveItem(item: MenuItem, liElement: HTMLLIElement) {
    if (this.submenuMode() === 'floating') {
      item.expanded = false;
      this.resetSubmenuPlacement(liElement);
    }
  }

  onRouterLinkIsActiveChange(item: MenuItem, isActive: boolean) {
    if (isActive) {
      item.original = Object.assign({}, { ...item, original: undefined });
      Object.assign(item, item.active);
    } else {
      Object.assign(item, {...item.original, original: undefined});
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
