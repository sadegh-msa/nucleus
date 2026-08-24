import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, type RouterEvent, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { type Mock, vi } from 'vitest';

import { PanelBreadcrumb } from './panel-breadcrumb';

describe('PanelBreadcrumb', () => {
  let service: PanelBreadcrumb;
  let router: { navigate: Mock; events: Subject<RouterEvent>; currentNavigation: Mock };
  let savedPathname: string;
  let originalReplaceState: typeof history.replaceState;

  beforeEach(() => {
    originalReplaceState = window.history.replaceState;
    savedPathname = window.location.pathname;
    history.replaceState.call(window.history, {}, '', '/users');

    router = {
      navigate: vi.fn(),
      events: new Subject<RouterEvent>(),
      currentNavigation: vi.fn().mockReturnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }],
    });
    service = TestBed.inject(PanelBreadcrumb);
  });

  afterEach(() => {
    window.history.replaceState = originalReplaceState;
    history.replaceState.call(window.history, {}, '', savedPathname);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('items', () => {
    it('should return a readonly signal', () => {
      const items = service.items();

      expect(Array.isArray(items)).toBe(true);
    });
  });

  describe('setTitle', () => {
    it('should update the last item label', () => {
      service.setTitle('New Title');

      const items = service.items();
      expect(items.length).toBeGreaterThan(0);
      expect(items[items.length - 1].label).toBe('New Title');
    });

    it('should not update when title is empty', () => {
      const initialItems = service.items();

      service.setTitle('');

      expect(service.items()).toEqual(initialItems);
    });
  });

  describe('router navigation', () => {
    const uuid = '123e4567-e89b-42d3-a456-426614174000';

    it('should rebuild items on NavigationEnd', () => {
      router.events.next(new NavigationEnd(1, '/users/add', '/users/add'));

      expect(service.items()).toEqual([
        { label: 'Users', routerLink: 'users' },
        { label: 'Add', routerLink: '' },
        { label: '<New Users>' },
      ]);
    });

    it('should use the navigation state title when the url ends with an id', () => {
      router.currentNavigation.mockReturnValue({ extras: { state: { title: 'John Doe' } } });

      router.events.next(new NavigationEnd(2, `/users/${uuid}`, `/users/${uuid}`));

      expect(service.items()).toEqual([
        { label: 'Users', routerLink: 'users' },
        { label: 'John Doe', routerLink: '' },
      ]);
    });

    it('should fall back to an ellipsis label when the navigation has no title', () => {
      router.events.next(new NavigationEnd(3, `/users/${uuid}`, `/users/${uuid}`));

      expect(service.items()[service.items().length - 1].label).toBe('...');
    });

    it('should not make edit actions linkable', () => {
      router.events.next(new NavigationEnd(4, `/users/${uuid}/edit`, `/users/${uuid}/edit`));

      const items = service.items();
      expect(items[items.length - 1].label).toBe('Edit');
      expect(items[items.length - 1].routerLink).toBe('');
    });

    it('should update items from a root Scroll event', () => {
      router.events.next(new Scroll(new NavigationEnd(5, '/', '/users/add'), null, ''));

      expect(service.items()[service.items().length - 1].label).toBe('<New Users>');
    });

    it('should ignore Scroll events for non-root navigations', () => {
      const initialItems = service.items();

      router.events.next(new Scroll(new NavigationEnd(6, '/other', '/users/add'), null, ''));

      expect(service.items()).toEqual(initialItems);
    });

    it('should keep items when the route resolves to the root path', () => {
      const initialItems = service.items();

      router.events.next(new NavigationEnd(7, '/', '/'));

      expect(service.items()).toEqual(initialItems);
    });
  });

  describe('history.replaceState proxy', () => {
    it('should update the last item label on a new state title', () => {
      window.history.replaceState({ title: 'Jane' }, '', '/users');

      expect(service.items()[service.items().length - 1].label).toBe('Jane');
    });

    it('should not update the items for an unchanged state title', () => {
      window.history.replaceState({ title: 'Same' }, '', '/users');
      const items = service.items();

      window.history.replaceState({ title: 'Same' }, '', '/users');

      expect(service.items()).toBe(items);
    });

    it('should not update the items when the state has no title', () => {
      const items = service.items();

      window.history.replaceState({ other: true }, '', '/users');

      expect(service.items()).toBe(items);
    });
  });
});
