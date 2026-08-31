import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '../providers/common-config-provider';
import { CookieManager } from './cookie-manager';
import { Cryptograph } from './cryptograph';

describe('CookieManager', () => {
  let service: CookieManager;
  let _document: Document;

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
      providers: [provideNuCommonConfig(mockConfig), Cryptograph],
    });
    service = TestBed.inject(CookieManager);
    _document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should set a cookie with encrypted value', async () => {
      const result = await service.setItem('testKey', 'testValue');

      expect(result).toBe(true);
    });

    it('should set cookie with expiration', async () => {
      const result = await service.setItem('testKey', 'testValue', 30);

      expect(result).toBe(true);
    });

    it('should set null value', async () => {
      const result = await service.setItem('testKey', null);

      expect(result).toBe(true);
    });

    it('should set numeric value', async () => {
      const result = await service.setItem('testKey', 123);

      expect(result).toBe(true);
    });

    it('should set boolean value', async () => {
      const result = await service.setItem('testKey', true);

      expect(result).toBe(true);
    });
  });

  describe('getItem', () => {
    it('should get a cookie value', async () => {
      await service.setItem('testKey', 'testValue');
      const value = await service.getItem('testKey');

      expect(value).toBe('testValue');
    });

    it('should return empty string for non-existent cookie', async () => {
      const value = await service.getItem('nonExistentKey');

      expect(value).toBe('');
    });

    it('should get numeric value', async () => {
      await service.setItem('testKey', 42);
      const value = await service.getItem('testKey');

      expect(value).toBe('42');
    });

    it('should get boolean value', async () => {
      await service.setItem('testKey', true);
      const value = await service.getItem('testKey');

      expect(value).toBe('true');
    });
  });

  describe('deleteItem', () => {
    it('should delete a cookie', async () => {
      await service.setItem('testKey', 'testValue');
      await service.deleteItem('testKey');

      const value = await service.getItem('testKey');
      expect(value).toBe('');
    });
  });

  describe('null/undefined stored values', () => {
    it('should return null for a cookie set with a null value', async () => {
      await service.setItem('testKey', null);

      expect(await service.getItem('testKey')).toBeNull();
    });

    it('should return null when the stored literal is "undefined"', async () => {
      _document.cookie = 'testKey=undefined;path=/';

      expect(await service.getItem('testKey')).toBeNull();
    });
  });

  describe('cryptograph failures', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    const configureWithCryptograph = (overrides: Partial<Cryptograph>) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideNuCommonConfig(mockConfig),
          { provide: Cryptograph, useValue: overrides },
        ],
      });

      return TestBed.inject(CookieManager);
    };

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should return false and log when encryption fails', async () => {
      const encrypt = vi.fn().mockRejectedValue(new Error('encrypt failed'));
      const brokenService = configureWithCryptograph({ encrypt } as Partial<Cryptograph>);

      const result = await brokenService.setItem('testKey', 'testValue');

      expect(result).toBe(false);
      expect(encrypt).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should return undefined and log when decryption fails', async () => {
      const decrypt = vi.fn().mockRejectedValue(new Error('decrypt failed'));
      const brokenService = configureWithCryptograph({ decrypt } as Partial<Cryptograph>);

      _document.cookie = 'testKey=somegarbage;path=/';
      const value = await brokenService.getItem('testKey');

      expect(value).toBeUndefined();
      expect(decrypt).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
