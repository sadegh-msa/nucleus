import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NU_COMMON_CONFIG } from '../providers/common-config.provider';
import { CookieService } from './cookie.service';
import { CryptoService } from './crypto.service';

describe('CookieService', () => {
  let service: CookieService;
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
      providers: [{ provide: NU_COMMON_CONFIG, useValue: mockConfig }, CryptoService],
    });
    service = TestBed.inject(CookieService);
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
});
