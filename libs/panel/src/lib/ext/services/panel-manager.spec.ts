import { TestBed } from '@angular/core/testing';
import { PermanentStorage } from '@nucleus/common';
import { type Mock, vi } from 'vitest';
import { PanelManager } from './panel-manager';

describe('PanelManager', () => {
  let service: PanelManager;
  let storageService: { getItem: Mock; setItem: Mock; removeItem: Mock };

  beforeEach(() => {
    storageService = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PermanentStorage, useValue: storageService }],
    });
    service = TestBed.inject(PanelManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navExtent', () => {
    it('should default to wide extent', () => {
      expect(service.navExtent()).toBe('wide');
    });

    it('should restore extent from storage', () => {
      storageService.getItem.mockReturnValue('compact');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: PermanentStorage, useValue: storageService }],
      });
      const newService = TestBed.inject(PanelManager);

      expect(newService.navExtent()).toBe('compact');
    });
  });

  describe('isNavCompact', () => {
    it('should return true when navExtent is compact', () => {
      service.navExtent.set('compact');

      expect(service.isNavCompact()).toBe(true);
    });

    it('should return false when navExtent is wide', () => {
      service.navExtent.set('wide');

      expect(service.isNavCompact()).toBe(false);
    });
  });

  describe('isNavWide', () => {
    it('should return true when navExtent is wide', () => {
      service.navExtent.set('wide');

      expect(service.isNavWide()).toBe(true);
    });

    it('should return false when navExtent is compact', () => {
      service.navExtent.set('compact');

      expect(service.isNavWide()).toBe(false);
    });
  });

  describe('isNavVisible', () => {
    it('should default to true', () => {
      expect(service.isNavVisible()).toBe(true);
    });

    it('should be settable', () => {
      service.isNavVisible.set(false);

      expect(service.isNavVisible()).toBe(false);
    });
  });

  describe('toggleNavExtent', () => {
    it('should toggle from wide to compact', () => {
      service.navExtent.set('wide');

      service.toggleNavExtent();

      expect(service.navExtent()).toBe('compact');
    });

    it('should toggle from compact to wide', () => {
      service.navExtent.set('compact');

      service.toggleNavExtent();

      expect(service.navExtent()).toBe('wide');
    });
  });

  describe('storage', () => {
    it('should store extent to permanent storage', () => {
      service.navExtent.set('compact');
      TestBed.flushEffects();

      expect(storageService.setItem).toHaveBeenCalled();
    });
  });
});
