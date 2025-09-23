import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  HostBinding,
  inject,
  input,
  linkedSignal,
  untracked,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { type Extent, SafeHtml } from '@nucleus/common';
import * as R from 'ramda';
import {
  PopoverDirective,
  RippleDirective,
  SvgIconDirective,
  TooltipDirective,
} from '../../directives';
import type { MenuItem } from '../../models';
import { CssSupportService } from '../../services';
import type { FabPlacement } from '../../types';

@Component({
  selector: 'menu[fabMenuItems]',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-items.component.html',
})
export class MenuItemsComponent {
  readonly #router = inject(Router);
  readonly #elementRef = inject(ElementRef);
  readonly #cssSupport = inject(CssSupportService);

  fabMenuItems = input.required<MenuItem[]>();
  popoverPlacement = input<FabPlacement>('inline-end-edge-end');
  tooltipPlacement = input<FabPlacement>('inline-end-block-center');
  extent = input<Extent>('wide');
  mode = input<'popup' | 'still'>('still');
  submenuMode = input<'floating' | 'sliding'>('sliding');
  common = input<MenuItem>({
    iconVariant: 'outline',
    ngClass: {
      'fab button medium rounded-none': true,
      'basic stamp second-ink': true,
      'bulk primary': false,
    },
  });
  active = input<MenuItem>({
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
  readonly items = linkedSignal<MenuItem[], MenuItem[]>({
    source: this.fabMenuItems,
    computation: (newItems) => {
      return this.#computeItems(R.clone(newItems));
    },
  });

  @HostBinding('class')
  get styleClass() {
    return Array.from(
      new Set([
        'fab menu',
        this.extent(),
        this.mode(),
        this.isSubmenuFloating() ? 'floating' : this.submenuMode(),
      ]),
    ).join(' ');
  }

  get menuElement() {
    return this.#elementRef.nativeElement as HTMLElement;
  }

  constructor() {
    if (!this.#cssSupport.calcSize()) {
      effect(() => {
        const items = this.items();

        untracked(() => {
          items
            .filter((i) => i.expanded) //
            .forEach((item) => this.#calculateSize(item));
        });
      });
    }

    effect(() => {
      const isSubmenuFloating = this.isSubmenuFloating();

      untracked(() => {
        if (isSubmenuFloating && this.isWide()) {
          this.items().forEach((i) => this.collapseItem(i));
        }
      });
    });
  }

  #computeItems(items: MenuItem[]) {
    items.forEach((item) => {
      Object.assign(item, R.mergeDeepRight({ ...(this.common() ?? {}) }, item) as MenuItem);
      item.active = R.mergeDeepLeft({ ...(this.active() ?? {}) }, item.active ?? {}) as MenuItem;
      item.isActive = item.routerLink === this.#router.url;

      if (item.children?.length) {
        this.#computeItems(item.children);

        if (this.isSubmenuSliding()) {
          item.expanded = item.children?.some((i) => i.expanded || i.isActive);
        }
      }
    });

    return items;
  }

  #calculateSize(item: MenuItem) {
    if (!item.expanded) {
      return 0;
    }

    item.children?.forEach((i) => {
      item.size ??= 0;
      item.size += this.#calculateSize(i) + 1;
    });

    return item.size ?? 0;
  }

  collapseItem(item: MenuItem) {
    item.children?.forEach((i) => this.collapseItem(i));
    item.expanded = false;
  }

  clickItem(item: MenuItem) {
    if (item.children?.length) {
      if (!item.expanded) {
        item.expanded = true;
      } else {
        this.collapseItem(item);
      }
    } else if (this.isSubmenuFloating()) {
      this.items().forEach((i) => this.collapseItem(i));
    } else if (this.isSubmenuSliding()) {
      if (!this.#cssSupport.calcSize()) {
        this.items().forEach((i) => this.#calculateSize(i));
      }
    }

    if (item.command) {
      item.command(item);
    }
  }

  onRouterLinkIsActiveChange(item: MenuItem, isActive: boolean) {
    item.isActive = isActive;

    if (isActive) {
      item.original = Object.assign({}, { ...item, original: undefined });
      Object.assign(item, { ...item.active });
    } else {
      for (const key of Object.keys(item.active || {})) {
        item[key as keyof MenuItem] = undefined;
      }

      Object.assign(item, { ...item.original, original: undefined });
    }
  }
}
