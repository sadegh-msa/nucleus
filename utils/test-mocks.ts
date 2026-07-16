export const MOCK_UI_CONFIG = {
  icon: { dir: 'icons' },
  message: { duration: 5000 },
  verification: { duration: 60, length: 6 },
};

export const MOCK_NU_COMMON_CONFIG = {
  api: { rest: { url: '', path: '', time: '' } },
  branding: {
    organization: {
      title: 'Test Org',
      homePage: '/',
      logo: {
        hTitle: { path: 'logo-h.svg', height: 30, width: 124 },
        noTitle: { path: 'logo-no.svg', height: 30, width: 30 },
        vTitle: { path: 'logo-v.svg', height: 60, width: 96 },
      },
    },
    manufacturer: {
      title: 'Test Mfr',
      homePage: '/',
      logo: {
        hTitle: { path: 'logo-h.svg', height: 30, width: 124 },
        noTitle: { path: 'logo-no.svg', height: 30, width: 30 },
        vTitle: { path: 'logo-v.svg', height: 60, width: 96 },
      },
    },
  },
  crypto: {
    algorithm: { name: 'AES-CTR' as const, length: 128 },
    secureKey: 'RnZhS1OkJsgwq72xAp854NcdC1GvmIvI',
  },
  links: { customerAgreement: '', privacyPolicy: '' },
};

export function setupGlobalMocks() {
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    (globalThis as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (typeof globalThis.ResizeObserver === 'undefined') {
    (globalThis as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (typeof globalThis.structuredClone === 'undefined') {
    (globalThis as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
  }
  if (typeof globalThis.CSS === 'undefined') {
    (globalThis as any).CSS = { supports: () => false };
  }
  if (typeof globalThis.crypto !== 'undefined' && !globalThis.crypto.subtle) {
    (globalThis.crypto as any).subtle = {
      importKey: jest.fn().mockResolvedValue({}),
      exportKey: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
      encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
      decrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    };
  }
}
