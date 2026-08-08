import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  input,
  linkedSignal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { type ExtentType, mergeDeepLeft, mergeDeepRight, SafeHtml } from '@nucleus/common';
import { filter, map } from 'rxjs/operators';
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass } from '../../../int/constants';
import { UiPopover, UiRipple, UiSvgIcon, UiTooltip } from '../../directives';
import { uniquifyStyleClass } from '../../helpers';
import type { UiMenuItemModel } from '../../models';
import { UiCssSupport } from '../../services';
import type { UiMenuModeType, UiMenuSubModeType, UiPlacementType } from '../../types';

const menuConfig = uiDefaultConfig.menu;
const menuStyleClass = uiStyleClass.menu;

@Component({
  selector: 'menu[uiMenuItems]',
  imports: [
    NgTemplateOutlet,
    NgStyle,
    NgClass,
    RouterLink,
    SafeHtml,
    UiSvgIcon,
    UiRipple,
    UiTooltip,
    UiPopover,
  ],
  templateUrl: './menu-items.html',
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiMenuItems {
  readonly #router = inject(Router);
  readonly #document = inject(DOCUMENT);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #uiCssSupport = inject(UiCssSupport);

  uiMenuItems = input.required<UiMenuItemModel[]>();
  popoverPlacement = input<UiPlacementType>(menuConfig.popoverPlacement);
  tooltipPlacement = input<UiPlacementType>(menuConfig.tooltipPlacement);
  extent = input<ExtentType>(menuConfig.extent);
  mode = input<UiMenuModeType>(menuConfig.mode);
  submenuMode = input<UiMenuSubModeType>(menuConfig.submenuMode);
  defaultStyle = input<UiMenuItemModel>({
    iconVariant: menuConfig.item.icon.variant.default,
    ngClass: {
      [menuStyleClass.item.button.basic]: true,
      [menuStyleClass.item.button.hover]: true,
      [menuStyleClass.item.button.active]: false,
    },
  });
  activeStyle = input<UiMenuItemModel>({
    iconVariant: menuConfig.item.icon.variant.active,
    ngClass: {
      ...((this.defaultStyle().ngClass as object) ?? {}),
      [menuStyleClass.item.button.hover]: false,
      [menuStyleClass.item.button.active]: true,
    },
  });

  readonly isCompact = computed(() => this.extent() === 'compact');
  readonly isWide = computed(() => this.extent() === 'wide');
  readonly isSubmenuFloating = computed(
    () => this.isCompact() || this.submenuMode() === 'floating', //
  );
  readonly isSubmenuSliding = computed(
    () => !this.isCompact() && this.submenuMode() === 'sliding', //
  );
  readonly styleClass = computed(() => {
    return uniquifyStyleClass(
      uiStyleClass.prefix,
      menuStyleClass.basic,
      menuStyleClass.status[this.extent()],
      menuStyleClass.status[this.mode()],
      this.isSubmenuFloating()
        ? menuStyleClass.status.floating
        : menuStyleClass.status[this.submenuMode()],
    );
  });

  readonly items = linkedSignal<UiMenuItemModel[], UiMenuItemModel[]>({
    source: this.uiMenuItems,
    computation: (newItems) => this.#computeItems(newItems),
  });

  #urlToItemMap: Record<string, UiMenuItemModel> = {};
  #currentUrl = this.#document.location.pathname;

  constructor() {
    this.#router.events
      .pipe(
        takeUntilDestroyed(), //
        filter((event) => event instanceof NavigationStart), //
        map((event) => event.url),
      )
      .subscribe((currentUrl) => {
        if (!Object.keys(this.#urlToItemMap).length) {
          return;
        }

        const previousUrl = this.#currentUrl;
        this.#currentUrl = currentUrl;

        const newItem = this.#urlToItemMap[this.#currentUrl];

        if (newItem) {
          this.setItemActivity(newItem, true);
        }

        if (previousUrl) {
          const previousItem = this.#urlToItemMap[previousUrl];

          if (previousItem) {
            this.setItemActivity(previousItem, false);
          }
        }
      });

    if (!this.#uiCssSupport.calcSize()) {
      effect(() => {
        this.items();
        untracked(() => this.#calculateSizes());
      });
    }

    effect(() => {
      const isSubmenuFloating = this.isSubmenuFloating();
      const isCompact = this.isCompact();

      untracked(() => {
        if (isSubmenuFloating && isCompact) {
          this.#collapseItems();
        }
      });
    });
  }

  #computeItems(items: UiMenuItemModel[]) {
    items.forEach((item) => {
      Object.assign(
        item,
        mergeDeepRight({ ...(this.defaultStyle() ?? {}) }, item) as UiMenuItemModel,
      );
      item.active = mergeDeepLeft(
        { ...(this.activeStyle() ?? {}) },
        item.active ?? {},
      ) as UiMenuItemModel;

      if (item.routerLink) {
        this.#urlToItemMap[item.routerLink.toString()] = item;

        if (item.routerLink === this.#currentUrl && !item.original) {
          this.setItemActivity(item, true);
        }
      }

      if (item.children?.length) {
        this.#computeItems(item.children);

        if (this.isSubmenuSliding()) {
          item.expanded = item.children?.some((i) => i.expanded || i.isActive);
        }
      }
    });

    return items;
  }

  #calculateItemSize(item: UiMenuItemModel) {
    if (!item.expanded) {
      return 0;
    }

    item.children?.forEach((i) => {
      item.size ??= 0;
      item.size += this.#calculateItemSize(i) + 1;
    });

    return item.size ?? 0;
  }

  #calculateSizes() {
    this.items().forEach((i) => {
      this.#calculateItemSize(i);
    });
  }

  #collapseItem(item: UiMenuItemModel) {
    item.children?.forEach((i) => {
      this.#collapseItem(i);
    });
    item.expanded = false;
  }

  #collapseItems() {
    this.items().forEach((i) => {
      this.#collapseItem(i);
    });
  }

  setItemActivity(item: UiMenuItemModel, isActive: boolean) {
    item.isActive = isActive;

    if (isActive) {
      const original = structuredClone(item);
      Object.assign(item, structuredClone(item.active), { original });
    } else {
      Object.keys(item.active || {}).forEach((key) => {
        item[key as keyof UiMenuItemModel] = undefined;
      });
      Object.assign(item, structuredClone(item.original), { original: undefined });
    }

    this.#changeDetectorRef.markForCheck();
  }

  onClick(item: UiMenuItemModel) {
    if (item.children?.length) {
      if (!item.expanded) {
        item.expanded = true;
      } else {
        this.#collapseItem(item);
      }
    } else if (this.isSubmenuFloating()) {
      this.#collapseItems();
    }

    if (this.isSubmenuSliding() && !this.#uiCssSupport.calcSize()) {
      this.#calculateSizes();
    }

    if (item.command) {
      item.command(item);
    }
  }
}
