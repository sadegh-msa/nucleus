import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '../providers/common-config.provider';
import { TemporaryStorage } from './temporary-storage';

describe('TemporaryStorage', () => {
  let service: TemporaryStorage;

  const mockConfig = {
    api: {
      rest: { url: 'http://localhost', path: '/api', time: '1000' },
    },
    branding: {} as any,
    links: { customerAgreement: '', privacyPolicy: '' },
    crypto: {
      algorithm: { name: 'AES-CTR' as const, length: 256 },
      secureKey: 'DFyaWAZZVnXY7dfQhogFEe3mint1xIRu',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNuCommonConfig(mockConfig)],
    });
    service = TestBed.inject(TemporaryStorage);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a string value', () => {
      const result = service.setItem('key', 'value');

      expect(result).toBe(true);
      expect(sessionStorage.getItem('key')).toBe('value');
    });

    it('should store a number value', () => {
      service.setItem('key', 123);

      expect(sessionStorage.getItem('key')).toBe('123');
    });

    it('should store an object as JSON', () => {
      const obj = { name: 'test', value: 123 };
      service.setItem('key', obj);

      expect(sessionStorage.getItem('key')).toBe(JSON.stringify(obj));
    });

    it('should store an array as JSON', () => {
      const arr = [1, 2, 3];
      service.setItem('key', arr);

      expect(sessionStorage.getItem('key')).toBe(JSON.stringify(arr));
    });

    it('should return false when value is undefined', () => {
      const result = service.setItem('key', undefined);

      expect(result).toBe(false);
    });

    it('should trim whitespace from string values', () => {
      service.setItem('key', '  value  ');

      expect(sessionStorage.getItem('key')).toBe('value');
    });
  });

  describe('getItem', () => {
    it('should retrieve a string value', () => {
      sessionStorage.setItem('key', 'value');

      const result = service.getItem('key');

      expect(result).toBe('value');
    });

    it('should retrieve a JSON object', () => {
      const obj = { name: 'test', value: 123 };
      sessionStorage.setItem('key', JSON.stringify(obj));

      const result = service.getItem('key');

      expect(result).toEqual(obj);
    });

    it('should retrieve a JSON array', () => {
      const arr = [1, 2, 3];
      sessionStorage.setItem('key', JSON.stringify(arr));

      const result = service.getItem('key');

      expect(result).toEqual(arr);
    });

    it('should return null for non-existent key', () => {
      const result = service.getItem('nonExistent');

      expect(result).toBeNull();
    });

    it('should throw when value looks like JSON but is not valid JSON', () => {
      sessionStorage.setItem('key', '{not json}');

      expect(() => service.getItem('key')).toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from sessionStorage', () => {
      sessionStorage.setItem('key', 'value');
      service.removeItem('key');

      expect(sessionStorage.getItem('key')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.removeItem('nonExistent')).not.toThrow();
    });
  });

  describe('setEncryptedItem', () => {
    it('should store an encrypted value', async () => {
      await service.setEncryptedItem('secret', 'sensitive data');

      const stored = sessionStorage.getItem('secret');
      expect(stored).toBeTruthy();
      expect(stored).not.toBe('sensitive data');
    });
  });

  describe('getEncryptedItem', () => {
    it('should retrieve and decrypt an encrypted value', async () => {
      await service.setEncryptedItem('secret', 'sensitive data');
      const result = await service.getEncryptedItem('secret');

      expect(result).toBe('sensitive data');
    });

    it('should return null for non-existent key', async () => {
      const result = await service.getEncryptedItem('nonExistent');

      expect(result).toBeNull();
    });

    it('should handle object values', async () => {
      const obj = { name: 'test', nested: { value: 123 } };
      await service.setEncryptedItem('secret', obj);
      const result = await service.getEncryptedItem('secret');

      expect(result).toEqual(obj);
    });
  });
});
