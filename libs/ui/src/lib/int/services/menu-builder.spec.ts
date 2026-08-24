import { TestBed } from '@angular/core/testing';

import { UiMenuBuilder } from './menu-builder';

describe('UiMenuBuilder', () => {
  let service: UiMenuBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UiMenuBuilder] });
    service = TestBed.inject(UiMenuBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateItemSize', () => {
    it('should return 0 for non-expanded item', () => {
      const item = { label: 'Test', expanded: false };
      expect(service.calculateItemSize(item)).toBe(0);
    });

    it('should calculate size for expanded item with children', () => {
      const item = {
        label: 'Parent',
        expanded: true,
        children: [
          { label: 'Child 1', expanded: false },
          { label: 'Child 2', expanded: true, children: [{ label: 'Grandchild' }] },
        ],
      };
      const size = service.calculateItemSize(item);
      expect(size).toBe(3);
    });

    it('should return 0 for item without children', () => {
      const item = { label: 'Test', expanded: true };
      expect(service.calculateItemSize(item)).toBe(0);
    });
  });

  describe('calculateItemSizes', () => {
    it('should calculate sizes for multiple items', () => {
      const items = [
        { label: 'Item 1', expanded: true, children: [{ label: 'Child' }] },
        { label: 'Item 2', expanded: false },
      ];
      service.calculateItemSizes(items);
      expect(items[0].size).toBe(1);
      expect(items[1].size).toBe(0);
    });
  });

  describe('collapseItem', () => {
    it('should collapse item and all nested children', () => {
      const item = {
        label: 'Parent',
        expanded: true,
        children: [
          { label: 'Child 1', expanded: true, children: [{ label: 'Grandchild', expanded: true }] },
          { label: 'Child 2', expanded: true },
        ],
      };
      service.collapseItem(item);
      expect(item.expanded).toBe(false);
      expect(item.children?.[0].expanded).toBe(false);
      expect(item.children?.[0].children?.[0].expanded).toBe(false);
      expect(item.children?.[1].expanded).toBe(false);
    });
  });

  describe('collapseItems', () => {
    it('should collapse all items in array', () => {
      const items = [
        { label: 'Item 1', expanded: true, children: [{ label: 'Child' }] },
        { label: 'Item 2', expanded: true },
      ];
      service.collapseItems(items);
      expect(items[0].expanded).toBe(false);
      expect(items[0].children?.[0].expanded).toBe(false);
      expect(items[1].expanded).toBe(false);
    });
  });

  describe('setItemActivity', () => {
    it('should set item as active and store original', () => {
      const item = { label: 'Test', expanded: false, icon: 'home' };
      const activeStyle = { icon: 'star', ngClass: { active: true } };
      item.active = activeStyle;

      service.setItemActivity(item, true);

      expect(item.isActive).toBe(true);
      expect(item.original).toEqual({ label: 'Test', expanded: false, icon: 'home' });
      expect(item.icon).toBe('star');
    });

    it('should restore original when setting inactive', () => {
      const item = { label: 'Test', expanded: true, icon: 'home' };
      const activeStyle = { icon: 'star' };
      item.active = activeStyle;

      service.setItemActivity(item, true);
      service.setItemActivity(item, false);

      expect(item.isActive).toBe(false);
      expect(item.icon).toBe('home');
      expect(item.original).toBeUndefined();
    });

    it('should handle item without active style', () => {
      const item = { label: 'Test', expanded: false };

      service.setItemActivity(item, true);
      service.setItemActivity(item, false);

      expect(item.isActive).toBe(false);
      expect(item.original).toBeUndefined();
    });

    it('should clear active properties when deactivating', () => {
      const item = { label: 'Test', expanded: false };
      item.active = { icon: 'star', customProp: 'value' };

      service.setItemActivity(item, true);
      service.setItemActivity(item, false);

      expect(item.icon).toBeUndefined();
      expect((item as any).customProp).toBeUndefined();
    });
  });
});
