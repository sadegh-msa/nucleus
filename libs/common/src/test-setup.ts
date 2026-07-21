import '@analogjs/vitest-angular/setup-testbed';

Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      importKey: vi.fn().mockResolvedValue({}),
      encrypt: vi.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
        const bytes = new Uint8Array(data);
        let binary = '';
        bytes.forEach((b: number) => {
          binary += String.fromCharCode(b);
        });
        return new TextEncoder().encode(btoa(binary));
      }),
      decrypt: vi.fn().mockImplementation(async (_algo: any, _key: any, data: any) => {
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
