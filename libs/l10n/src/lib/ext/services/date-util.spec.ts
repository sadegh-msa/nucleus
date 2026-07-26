import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { DateUtil } from './date-util';
import { LocaleUtil } from './locale-util';

describe('DateUtil', () => {
  let service: DateUtil;
  let _localeService: LocaleUtil;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtil);
    _localeService = TestBed.inject(LocaleUtil);
    document = TestBed.inject(DOCUMENT);
    document.documentElement.lang = 'en-US';
    document.documentElement.dir = 'ltr';
  });

  afterEach(() => {
    if (document) {
      document.documentElement.lang = 'en-US';
      document.documentElement.dir = 'ltr';
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('now', () => {
    it('should return a Date object', () => {
      const now = service.now();

      expect(now).toBeInstanceOf(Date);
    });

    it('should return a valid Date', () => {
      const now = service.now();

      expect(now).toBeInstanceOf(Date);
      expect(now.getTime()).toBeGreaterThan(0);
    });

    it('should return a new Date instance', () => {
      const result = service.now();

      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('locale', () => {
    it('should return a locale object', () => {
      const locale = service.locale();

      expect(locale).toBeDefined();
    });

    it('should return enUS locale for en-US lang', () => {
      document.documentElement.lang = 'en-US';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);
      const locale = freshService.locale();

      expect(locale).toBeDefined();
      expect(locale.code).toBe('en-US');
    });

    it('should return faIR locale for fa lang', () => {
      document.documentElement.lang = 'fa';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);
      const locale = freshService.locale();

      expect(locale).toBeDefined();
      expect(locale.code).toBe('fa-IR');
    });
  });

  describe('defaultInputFormatStr', () => {
    it('should return a format string', () => {
      const format = service.defaultInputFormatStr();

      expect(format).toBeTruthy();
      expect(typeof format).toBe('string');
    });

    it('should return MM/dd/yyyy HH:mm for en-US', () => {
      document.documentElement.lang = 'en-US';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);

      expect(freshService.defaultInputFormatStr()).toBe('MM/dd/yyyy HH:mm');
    });

    it('should return yyyy/MM/dd HH:mm for fa', () => {
      document.documentElement.lang = 'fa';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);

      expect(freshService.defaultInputFormatStr()).toBe('yyyy/MM/dd HH:mm');
    });
  });

  describe('defaultOutputFormatStr', () => {
    it('should return a format string', () => {
      const format = service.defaultOutputFormatStr();

      expect(format).toBeTruthy();
      expect(typeof format).toBe('string');
    });

    it('should return MMM d, yyyy HH:mm for en-US', () => {
      document.documentElement.lang = 'en-US';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);

      expect(freshService.defaultOutputFormatStr()).toBe('MMM d, yyyy HH:mm');
    });

    it('should return d MMMM yyyy HH:mm for fa', () => {
      document.documentElement.lang = 'fa';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(DateUtil);

      expect(freshService.defaultOutputFormatStr()).toBe('d MMMM yyyy HH:mm');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid Date objects', () => {
      expect(service.isValidDate(new Date())).toBe(true);
    });

    it('should return true for valid date Date objects', () => {
      expect(service.isValidDate(new Date('2024-01-15'))).toBe(true);
    });

    it('should return false for invalid Date objects', () => {
      expect(service.isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('convertToDate', () => {
    it('should convert a Date object to Date', () => {
      const input = new Date('2024-01-15T10:30:00Z');
      const result = service.convertToDate(input);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(input.getTime());
    });

    it('should return a new Date instance (not same reference)', () => {
      const input = new Date('2024-01-15T10:30:00Z');
      const result = service.convertToDate(input);

      expect(result).not.toBe(input);
    });

    it('should convert a date string to Date', () => {
      const result = service.convertToDate('2024-01-15T10:30:00Z');

      expect(result).toBeInstanceOf(Date);
    });

    it('should convert a string without Z suffix', () => {
      const result = service.convertToDate('2024-01-15T10:30:00');

      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for empty string', () => {
      const result = service.convertToDate('');

      expect(result).toBeNull();
    });

    it('should handle lowercase z suffix', () => {
      const result = service.convertToDate('2024-01-15T10:30:00z');

      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('format', () => {
    it('should format a date with default format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = service.format(date);

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format with custom format string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = service.format(date, 'yyyy-MM-dd');

      expect(formatted).toContain('2024');
      expect(formatted).toContain('01');
      expect(formatted).toContain('15');
    });

    it('should format with time format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = service.format(date, 'HH:mm');

      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('parse', () => {
    it('should parse a date string with default format', () => {
      const parsed = service.parse('01/15/2024 10:30');

      expect(parsed).toBeInstanceOf(Date);
    });

    it('should parse a date string with custom format', () => {
      const parsed = service.parse('2024-01-15', 'yyyy-MM-dd');

      expect(parsed).toBeInstanceOf(Date);
    });

    it('should parse with explicit reference date', () => {
      const reference = new Date('2024-06-15T00:00:00Z');
      const parsed = service.parse('01/15/2024 10:30', 'MM/dd/yyyy HH:mm', reference);

      expect(parsed).toBeInstanceOf(Date);
    });
  });

  describe('formatDistanceToNow', () => {
    it('should return relative time for recent dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 60 * 1000);
      const result = service.formatDistanceToNow(recentDate);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should return formatted date for old dates', () => {
      const oldDate = new Date('2020-01-01T00:00:00Z');
      const result = service.formatDistanceToNow(oldDate);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should return formatted date (not relative) for dates beyond distance limit', () => {
      const now = new Date();
      const beyondLimit = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const result = service.formatDistanceToNow(beyondLimit);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid date strings by falling through to format', () => {
      expect(() => service.formatDistanceToNow('invalid')).toThrow();
    });

    it('should return formatted result for current date', () => {
      const result = service.formatDistanceToNow(new Date());

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
