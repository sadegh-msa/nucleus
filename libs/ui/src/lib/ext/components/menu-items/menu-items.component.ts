import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, untracked } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { type Extent, SafeHtml } from '@nucleus/common';
import * as R from 'ramda';
import {
  PopoverDirective,
  RippleDirective,
  SvgIconDirective,
  TooltipDirective,
} from '../../directives';
import type { MenuItemModel } from '../../models';
import { CssSupport } from '../../services';
import type { FabPlacement } from '../../types';

@Component({
  selector: 'menu[uiMenuItems]',
  imports: [
    NgTemplateOutlet,
    NgStyle,
    NgClass,
    RouterLink,
    RouterLinkActive,
    SafeHtml,
    SvgIconDirective,
    RippleDirective,
    TooltipDirective,
    PopoverDirective,
  ],
  templateUrl: './menu-items.component.html',
  host: {
    '[class]': 'styleClass',
  },
})
export class MenuItemsComponent {
  readonly #router = inject(Router);
  readonly #cssSupport = inject(CssSupport);

  uiMenuItems = input.required<MenuItemModel[]>();
  popoverPlacement = input<FabPlacement>('inline-end-edge-end');
  tooltipPlacement = input<FabPlacement>('inline-end-block-center');
  extent = input<Extent>('wide');
  mode = input<'popup' | 'still'>('still');
  submenuMode = input<'floating' | 'sliding'>('sliding');
  common = input<MenuItemModel>({
    iconVariant: 'outline',
    ngClass: {
      'ui button medium rounded-none': true,
      'basic stamp second-ink': true,
      'bulk primary': false,
    },
  });
  active = input<MenuItemModel>({
    iconVariant: 'bold',
    ngClass: {
      ...((this.common().ngClass as object) ?? {}),
      'basic stamp second-ink': false,
      'bulk primary': true,
    },
  });

  readonly isCompact = computed(() => this.extent() === 'compact');
  readonly isWide = computed(() => this.extent() === 'wide');
  readonly isSubmenuFloating = computed(
    () => this.isCompact() || this.submenuMode() === 'floating',
  );
  readonly isSubmenuSliding = computed(() => !this.isCompact() && this.submenuMode() === 'sliding');
  readonly items = linkedSignal<MenuItemModel[], MenuItemModel[]>({
    source: this.uiMenuItems,
    computation: (newItems) => {
      return this.#computeItems(R.clone(newItems));
    },
  });

  get styleClass() {
    return Array.from(
      new Set([
        'ui menu',
        this.extent(),
        this.mode(),
        this.isSubmenuFloating() ? 'floating' : this.submenuMode(),
      ]),
    ).join(' ');
  }

  constructor() {
    if (!this.#cssSupport.calcSize()) {
      effect(() => {
        const items = this.items();

        untracked(() => {
          items
            .filter((i) => i.expanded) //
            .forEach((item) => {
              this.#calculateSize(item);
            });
        });
      });
    }

    effect(() => {
      const isSubmenuFloating = this.isSubmenuFloating();
      const isWide = this.isWide();

      untracked(() => {
        if (isSubmenuFloating && isWide) {
          this.items().forEach((i) => {
            this.collapseItem(i);
          });
        }
      });
    });
  }

  #computeItems(items: MenuItemModel[]) {
    const currentUrl = this.#router.url;

    items.forEach((item) => {
      Object.assign(item, R.mergeDeepRight({ ...(this.common() ?? {}) }, item) as MenuItemModel);
      item.active = R.mergeDeepLeft(
        { ...(this.active() ?? {}) },
        item.active ?? {},
      ) as MenuItemModel;
      item.isActive = item.routerLink === currentUrl;

      if (item.children?.length) {
        this.#computeItems(item.children);

        if (this.isSubmenuSliding()) {
          item.expanded = item.children?.some((i) => i.expanded || i.isActive);
        }
      }
    });

    return items;
  }

  #calculateSize(item: MenuItemModel) {
    if (!item.expanded) {
      return 0;
    }

    item.children?.forEach((i) => {
      item.size ??= 0;
      item.size += this.#calculateSize(i) + 1;
    });

    return item.size ?? 0;
  }

  collapseItem(item: MenuItemModel) {
    item.children?.forEach((i) => {
      this.collapseItem(i);
    });
    item.expanded = false;
  }

  clickItem(item: MenuItemModel) {
    if (item.children?.length) {
      if (!item.expanded) {
        item.expanded = true;
      } else {
        this.collapseItem(item);
      }
    } else if (this.isSubmenuFloating()) {
      this.items().forEach((i) => {
        this.collapseItem(i);
      });
    }

    if (this.isSubmenuSliding()) {
      if (!this.#cssSupport.calcSize()) {
        this.items().forEach((i) => {
          this.#calculateSize(i);
        });
      }
    }

    if (item.command) {
      item.command(item);
    }
  }

  onRouterLinkIsActiveChange(item: MenuItemModel, isActive: boolean) {
    item.isActive = isActive;

    if (isActive) {
      item.original = structuredClone({ ...item, original: undefined });
      Object.assign(item, structuredClone(item.active));
    } else {
      for (const key of Object.keys(item.active || {})) {
        item[key as keyof MenuItemModel] = undefined;
      }

      Object.assign(item, structuredClone(item.original));
      item.original = undefined;
    }
  }
}
