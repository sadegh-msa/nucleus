import { injectAsync, Service } from '@angular/core';

@Service()
export class TemporaryStorage {
  readonly #loadCrypto = injectAsync(() => import('./cryptograph').then((m) => m.Cryptograph));

  async setEncryptedItem(key: string, value: unknown) {
    const crypto = await this.#loadCrypto();
    sessionStorage.setItem(key, await crypto.encrypt(JSON.stringify(value)));
  }

  async getEncryptedItem<T>(key: string) {
    const encryptedValue = sessionStorage.getItem(key);
    const crypto = await this.#loadCrypto();

    return encryptedValue
      ? (JSON.parse(await crypto.decrypt(encryptedValue)) as unknown as T)
      : null;
  }

  removeItem(key: string) {
    sessionStorage.removeItem(key);
  }

  setItem(key: string, value: unknown) {
    let normalizedValue = value;

    if (typeof value === 'object') {
      normalizedValue = JSON.stringify(value);
    }

    if (value !== undefined) {
      sessionStorage.setItem(key, String(normalizedValue).trim());
      return true;
    }

    return false;
  }

  getItem<T = string>(key: string) {
    const value = sessionStorage.getItem(key);

    if (value !== undefined) {
      if (value?.startsWith('{') || value?.startsWith('[')) {
        return JSON.parse(value) as unknown as T;
      }
    }

    return value as T;
  }
}
