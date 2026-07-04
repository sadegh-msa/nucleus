import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as any).CSS = { supports: jest.fn().mockReturnValue(true) };
}

if (typeof (globalThis as any).$localize === 'undefined') {
  (globalThis as any).$localize = (strings: TemplateStringsArray): string => strings.raw[0];
}
