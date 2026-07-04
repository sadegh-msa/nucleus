import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

(globalThis as any).$localize = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((result, str, i) => result + str + (values[i] || ''), '');

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
