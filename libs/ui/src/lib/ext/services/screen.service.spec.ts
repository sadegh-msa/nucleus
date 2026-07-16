import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ScreenService } from './screen.service';

describe('ScreenService', () => {
  let service: ScreenService;
  let _document: Document;

  beforeEach(() => {
    Object.defineProperty(window, 'screen', {
      value: { availWidth: 1920, availHeight: 1080 },
      writable: true,
      configurable: true,
    });

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue('16px'),
    } as unknown as CSSStyleDeclaration);

    Object.defineProperty(globalThis, 'ResizeObserver', {
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenService);
    _document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('breakpoints', () => {
    it('should have breakpoint properties', () => {
      const breakpoints = service.breakpoints();

      expect(breakpoints).toHaveProperty('isXs');
      expect(breakpoints).toHaveProperty('isSm');
      expect(breakpoints).toHaveProperty('isGtSm');
      expect(breakpoints).toHaveProperty('isMd');
      expect(breakpoints).toHaveProperty('isGtMd');
      expect(breakpoints).toHaveProperty('isLg');
      expect(breakpoints).toHaveProperty('isGtLg');
      expect(breakpoints).toHaveProperty('isXl');
      expect(breakpoints).toHaveProperty('isGtXl');
      expect(breakpoints).toHaveProperty('isGtXxl');
      expect(breakpoints).toHaveProperty('isHandset');
      expect(breakpoints).toHaveProperty('isGtHandset');
      expect(breakpoints).toHaveProperty('isTablet');
      expect(breakpoints).toHaveProperty('isWeb');
      expect(breakpoints).toHaveProperty('isPortrait');
      expect(breakpoints).toHaveProperty('isLandscape');
    });

    it('should return boolean values for all breakpoints', () => {
      const breakpoints = service.breakpoints();

      Object.values(breakpoints).forEach((value) => {
        expect(typeof value).toBe('boolean');
      });
    });

    it('should have mutually exclusive size categories', () => {
      const b = service.breakpoints();

      if (b.isXs) {
        expect(b.isSm).toBe(false);
        expect(b.isMd).toBe(false);
        expect(b.isLg).toBe(false);
        expect(b.isXl).toBe(false);
      }
    });

    it('should classify a 1920px wide screen as web', () => {
      const b = service.breakpoints();
      expect(b.isWeb).toBe(true);
    });

    it('should detect landscape orientation', () => {
      const b = service.breakpoints();
      expect(b.isLandscape).toBe(true);
    });
  });
});
