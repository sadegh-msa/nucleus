import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '../providers/common-config-provider';
import { Cryptograph } from './cryptograph';

describe('Cryptograph', () => {
  let service: Cryptograph;

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
    service = TestBed.inject(Cryptograph);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('encrypt', () => {
    it('should encrypt a string and return base64', async () => {
      const plaintext = 'hello world';
      const encrypted = await service.encrypt(plaintext);

      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(plaintext);
    });

    it('should produce consistent encryption for the same input', async () => {
      const plaintext = 'consistent test';
      const encrypted1 = await service.encrypt(plaintext);
      const encrypted2 = await service.encrypt(plaintext);

      expect(encrypted1).toBe(encrypted2);
    });

    it('should encrypt empty string', async () => {
      const encrypted = await service.encrypt('');

      expect(typeof encrypted).toBe('string');
    });

    it('should encrypt special characters', async () => {
      const plaintext = '!@#$%^&*()_+{}|:"<>?';
      const encrypted = await service.encrypt(plaintext);

      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(plaintext);
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string back to original', async () => {
      const plaintext = 'hello world';
      const encrypted = await service.encrypt(plaintext);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should decrypt empty string', async () => {
      const plaintext = '';
      const encrypted = await service.encrypt(plaintext);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should decrypt special characters', async () => {
      const plaintext = '!@#$%^&*()_+{}|:"<>?';
      const encrypted = await service.encrypt(plaintext);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should decrypt unicode characters', async () => {
      const plaintext = 'سلام دنیا';
      const encrypted = await service.encrypt(plaintext);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });
  });
});
