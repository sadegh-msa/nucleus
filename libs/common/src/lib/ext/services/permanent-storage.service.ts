import { injectAsync, Service } from '@angular/core';

@Service()
export class PermanentStorageService {
  readonly #loadCryptoService = injectAsync(() =>
    import('./crypto.service').then((m) => m.CryptoService),
  );

  async setEncryptedItem(key: string, value: unknown) {
    const cryptoService = await this.#loadCryptoService();
    localStorage.setItem(key, await cryptoService.encrypt(JSON.stringify(value)));
  }

  async getEncryptedItem<T = string>(key: string) {
    const encryptedValue = localStorage.getItem(key);
    const cryptoService = await this.#loadCryptoService();

    return encryptedValue
      ? (JSON.parse(await cryptoService.decrypt(encryptedValue)) as unknown as T)
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
