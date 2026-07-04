import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      importKey: jest.fn().mockResolvedValue({}),
      encrypt: jest.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
        const bytes = new Uint8Array(data);
        let binary = '';
        bytes.forEach((b) => {
          binary += String.fromCharCode(b);
        });
        return new TextEncoder().encode(btoa(binary));
      }),
      decrypt: jest.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
        const base64Str = new TextDecoder().decode(data);
        const binary = atob(base64Str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
      }),
    },
    getRandomValues: (arr: any) => arr,
  },
  writable: true,
});
