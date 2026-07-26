import { injectAsync } from '@angular/core';

export abstract class AbstractStorage {
  readonly #loadCrypto = injectAsync(() => import('../../ext/services/cryptograph').then((m) => m.Cryptograph));

  protected constructor(protected readonly storage: Storage) {}

  async setEncryptedItem(key: string, value: unknown) {
    const crypto = await this.#loadCrypto();
    this.storage.setItem(key, await crypto.encrypt(JSON.stringify(value)));
  }

  async getEncryptedItem<T = string>(key: string) {
    const encryptedValue = this.storage.getItem(key);
    const crypto = await this.#loadCrypto();

    return encryptedValue
      ? (JSON.parse(await crypto.decrypt(encryptedValue)) as unknown as T)
      : null;
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: unknown) {
    let normalizedValue = value;

    if (typeof value === 'object') {
      normalizedValue = JSON.stringify(value);
    }

    if (value !== undefined) {
      this.storage.setItem(key, String(normalizedValue).trim());
      return true;
    }

    return false;
  }

  getItem<T = string>(key: string) {
    const value = this.storage.getItem(key);

    if (value === null) {
      return null as T;
    }

    if (value.startsWith('{') || value.startsWith('[')) {
      return JSON.parse(value) as unknown as T;
    }

    return value as T;
  }
}
