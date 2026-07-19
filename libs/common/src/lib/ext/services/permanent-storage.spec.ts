import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '../providers/common-config.provider';
import { PermanentStorage } from './permanent-storage';

describe('PermanentStorage', () => {
  let service: PermanentStorage;

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
    service = TestBed.inject(PermanentStorage);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a string value', () => {
      const result = service.setItem('key', 'value');

      expect(result).toBe(true);
      expect(localStorage.getItem('key')).toBe('value');
    });

    it('should store a number value', () => {
      service.setItem('key', 123);

      expect(localStorage.getItem('key')).toBe('123');
    });

    it('should store an object as JSON', () => {
      const obj = { name: 'test', value: 123 };
      service.setItem('key', obj);

      expect(localStorage.getItem('key')).toBe(JSON.stringify(obj));
    });

    it('should store an array as JSON', () => {
      const arr = [1, 2, 3];
      service.setItem('key', arr);

      expect(localStorage.getItem('key')).toBe(JSON.stringify(arr));
    });

    it('should return false when value is undefined', () => {
      const result = service.setItem('key', undefined);

      expect(result).toBe(false);
    });

    it('should trim whitespace from string values', () => {
      service.setItem('key', '  value  ');

      expect(localStorage.getItem('key')).toBe('value');
    });
  });

  describe('getItem', () => {
    it('should retrieve a string value', () => {
      localStorage.setItem('key', 'value');

      const result = service.getItem('key');

      expect(result).toBe('value');
    });

    it('should retrieve a JSON object', () => {
      const obj = { name: 'test', value: 123 };
      localStorage.setItem('key', JSON.stringify(obj));

      const result = service.getItem('key');

      expect(result).toEqual(obj);
    });

    it('should retrieve a JSON array', () => {
      const arr = [1, 2, 3];
      localStorage.setItem('key', JSON.stringify(arr));

      const result = service.getItem('key');

      expect(result).toEqual(arr);
    });

    it('should return null for non-existent key', () => {
      const result = service.getItem('nonExistent');

      expect(result).toBeNull();
    });

    it('should throw when value looks like JSON but is not valid JSON', () => {
      localStorage.setItem('key', '{not json}');

      expect(() => service.getItem('key')).toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from localStorage', () => {
      localStorage.setItem('key', 'value');
      service.removeItem('key');

      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.removeItem('nonExistent')).not.toThrow();
    });
  });

  describe('setEncryptedItem', () => {
    it('should store an encrypted value', async () => {
      await service.setEncryptedItem('secret', 'sensitive data');

      const stored = localStorage.getItem('secret');
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
