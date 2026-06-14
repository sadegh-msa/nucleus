import { inject, Service } from '@angular/core';
import { CryptoService } from './crypto.service';

@Service()
export class PermanentStorageService {
  readonly #cryptoService = inject(CryptoService);

  async setEncryptedItem(key: string, value: unknown) {
    localStorage.setItem(key, await this.#cryptoService.encrypt(JSON.stringify(value)));
  }

  async getEncryptedItem<T = string>(key: string) {
    const encryptedValue = localStorage.getItem(key);

    return encryptedValue
      ? (JSON.parse(await this.#cryptoService.decrypt(encryptedValue)) as unknown as T)
      : null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: unknown) {
    let normalizedValue = value;

    if (typeof value === 'object') {
      normalizedValue = JSON.stringify(value);
    }

    if (value !== undefined) {
      localStorage.setItem(key, String(normalizedValue).trim());
      return true;
    }

    return false;
  }

  getItem<T = string>(key: string) {
    const value = localStorage.getItem(key);

    if (value !== undefined) {
      if (value?.startsWith('{') || value?.startsWith('[')) {
        return JSON.parse(value) as unknown as T;
      }
    }

    return value as T;
  }
}
