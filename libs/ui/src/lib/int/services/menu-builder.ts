import { Service } from '@angular/core';
import type { UiMenuItemModel } from '../../ext/models/menu-item.model';

@Service()
export class UiMenuBuilder {
  calculateItemSize(item: UiMenuItemModel) {
    if (!item.expanded) {
      item.size = 0;
      return 0;
    }

    item.size ??= 0;
    item.children?.forEach((i) => {
      item.size! += this.calculateItemSize(i) + 1;
    });

    return item.size ?? 0;
  }

  calculateItemSizes(items: UiMenuItemModel[]) {
    items.forEach((i) => {
      this.calculateItemSize(i);
    });
  }

  collapseItem(item: UiMenuItemModel) {
    item.children?.forEach((i) => {
      this.collapseItem(i);
    });
    item.expanded = false;
  }

  collapseItems(items: UiMenuItemModel[]) {
    items.forEach((i) => {
      this.collapseItem(i);
    });
  }

  setItemActivity(item: UiMenuItemModel, isActive: boolean) {
    if (isActive) {
      const original = structuredClone({ ...item, original: undefined });
      Object.assign(item, structuredClone(item.active), { original });
    } else {
      const original = { ...item.original };
      item.original = undefined;

      Object.keys(item.active ?? {}).forEach((key) => {
        item[key as keyof UiMenuItemModel] = undefined;
      });
      Object.assign(item, original);
    }

    item.isActive = isActive;
  }
}
