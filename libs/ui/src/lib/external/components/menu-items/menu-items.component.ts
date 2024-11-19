import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
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
  submenuMode = input<'afloat' | 'sliding'>('afloat', {
    alias: 'uiMenuSubmenuMode',
  });

  readonly isCompact = computed(() => this.mode() === 'compact');
  readonly isWide = computed(() => this.mode() === 'wide');

  @HostBinding('class')
  get styleClass() {
    return [
      this.setStyleClass() ? 'ui menu' : '',
      this.mode(),
      this.isCompact() ? 'afloat' : this.submenuMode(),
    ].join(' ');
  }

  collapseItem(item: MenuItem) {
    item.children?.forEach((i) => this.collapseItem(i));
    item.expanded = false;
  }

  clickItem(item: MenuItem) {
    const submenuMode = this.submenuMode();

    if (item.children?.length) {
     item.expanded = submenuMode === 'afloat' || !item.expanded;

     if (!item.expanded) {
       this.collapseItem(item);
     }
    } else if (submenuMode === 'afloat') {
      this.items().forEach((i) => this.collapseItem(i));
    }

    if (item.command) {
      item.command(item);
    }
  }

  pointerdownItem(item: MenuItem) {
    if (this.submenuMode() === 'afloat') {
      if (!item.children?.length) {
        item.expanded = false;
      }
    }
  }

  pointerenterItem(item: MenuItem) {
    if (this.submenuMode() === 'afloat') {
      item.expanded = true;
    }
  }

  pointerleaveItem(item: MenuItem) {
    if (this.submenuMode() === 'afloat') {
      item.expanded = false;
    }
  }
}
