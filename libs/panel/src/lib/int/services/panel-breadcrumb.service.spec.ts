import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PanelBreadcrumbService } from './panel-breadcrumb.service';

describe('PanelBreadcrumbService', () => {
  let service: PanelBreadcrumbService;
  let router: { navigate: jest.Mock; events: { pipe: jest.Mock }; currentNavigation: jest.Mock };
  let savedPathname: string;
  let originalReplaceState: typeof history.replaceState;

  beforeEach(() => {
    originalReplaceState = window.history.replaceState;
    savedPathname = window.location.pathname;
    history.replaceState.call(window.history, {}, '', '/users');

    router = {
      navigate: jest.fn(),
      events: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
      currentNavigation: jest.fn().mockReturnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }],
    });
    service = TestBed.inject(PanelBreadcrumbService);
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
});
