import { inject, Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class TemporaryStorageService {
  readonly #cryptoService = inject(CryptoService);

  async setEncryptedItem(key: string, value: unknown) {
    sessionStorage.setItem(key, await this.#cryptoService.encrypt(JSON.stringify(value)));
  }

  async getEncryptedItem<T>(key: string) {
    const encryptedValue = sessionStorage.getItem(key);

    return encryptedValue
      ? (JSON.parse(await this.#cryptoService.decrypt(encryptedValue)) as unknown as T)
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
