import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';
import { CryptoUtils } from './crypto-utils';

@Service()
export class CookieManager {
  readonly #document = inject(DOCUMENT);
  readonly #cryptoUtils = inject(CryptoUtils);

  async setItem(key: string, value: boolean | number | string | null, exMinutes?: number) {
    let expires = '';

    if (exMinutes) {
      const date = new Date();
      date.setTime(date.getTime() + exMinutes * 60 * 1000);
      expires = `expires=${date.toUTCString()}`;
    }

    try {
      const encryptedValue = value ? await this.#cryptoUtils.encrypt(value.toString()) : value;
      this.#document.cookie = `${key}=${encryptedValue};${expires};path=/`;
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  async getItem(key: string) {
    const decodedCookie = decodeURIComponent(this.#document.cookie);
    const pairs = decodedCookie.split(';').map((i) =>
      i
        .trim()
        .split('=')
        .map((v) => v.trim()),
    );
    const encryptedValue = (pairs.find(([k, v]) => k === key) || [])[1] || '';

    if (['null', 'undefined'].includes(encryptedValue)) {
      return null;
    }

    let value: boolean | string | number | undefined;

    try {
      value = await this.#cryptoUtils.decrypt(encryptedValue);
    } catch (error) {
      console.error(error);
      value = undefined;
    }

    return value;
  }

  deleteItem(key: string) {
    return this.setItem(key, '', -1);
  }
}
