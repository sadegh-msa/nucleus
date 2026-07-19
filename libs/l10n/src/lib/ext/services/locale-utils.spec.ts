import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { LocaleUtils } from './locale-utils';

describe('LocaleUtils', () => {
  let service: LocaleUtils;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleUtils);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    if (document) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('lang', () => {
    it('should return the current document language', () => {
      const lang = service.lang();

      expect(lang).toBeTruthy();
    });

    it('should be a readonly signal', () => {
      expect(service.lang).toBeDefined();
      expect(typeof service.lang).toBe('function');
    });

    it('should reflect initial document lang', () => {
      document.documentElement.lang = 'fa';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(LocaleUtils);

      expect(freshService.lang()).toBe('fa');
    });
  });

  describe('dir', () => {
    it('should return the current document direction', () => {
      const dir = service.dir();

      expect(dir).toBeTruthy();
      expect(['ltr', 'rtl']).toContain(dir);
    });

    it('should reflect initial document dir', () => {
      document.documentElement.dir = 'rtl';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(LocaleUtils);

      expect(freshService.dir()).toBe('rtl');
    });
  });

  describe('isLtr', () => {
    it('should return true when direction is ltr', () => {
      expect(service.isLtr()).toBe(true);
      expect(service.isRtl()).toBe(false);
    });
  });

  describe('isRtl', () => {
    it('should return false when direction is ltr', () => {
      expect(service.isRtl()).toBe(false);
    });
  });

  describe('isPersian', () => {
    it('should return false when lang is en-US', () => {
      expect(service.isPersian()).toBe(false);
    });

    it('should return false when lang is en', () => {
      document.documentElement.lang = 'en';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(LocaleUtils);

      expect(freshService.isPersian()).toBe(false);
    });
  });

  describe('setLang', () => {
    it('should update the document language', () => {
      service.setLang('fa');

      expect(document.documentElement.lang).toBe('fa');
    });
  });

  describe('setDir', () => {
    it('should update the document direction', () => {
      service.setDir('rtl');

      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  describe('MutationObserver', () => {
    it('should update lang signal when service is created with fa lang', () => {
      document.documentElement.lang = 'fa';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(LocaleUtils);

      expect(freshService.lang()).toBe('fa');
      expect(freshService.isPersian()).toBe(true);
    });

    it('should update dir signal when service is created with rtl dir', () => {
      document.documentElement.dir = 'rtl';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(LocaleUtils);

      expect(freshService.dir()).toBe('rtl');
      expect(freshService.isRtl()).toBe(true);
      expect(freshService.isLtr()).toBe(false);
    });
  });
});
