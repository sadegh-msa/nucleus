import { Service } from '@angular/core';
import { injectNuCommonConfig } from '../providers/common-config-provider';

@Service()
export class Cryptograph {
  readonly #textEncoder = new TextEncoder();
  readonly #textDecoder = new TextDecoder('utf-8');

  readonly #algorithm = (() => {
    const { algorithm, secureKey } = injectNuCommonConfig().crypto;

    return {
      name: algorithm.name,
      length: algorithm.length,
      counter: this.#textEncoder.encode(secureKey.slice(0, 16)),
    };
  })();

  readonly #key = (() => {
    const { counter, name } = this.#algorithm;

    return window.crypto.subtle.importKey('raw', counter, name, false, ['encrypt', 'decrypt']);
  })();

  async encrypt(text: string) {
    const arrayBuffer = await window.crypto.subtle.encrypt(
      this.#algorithm,
      await this.#key,
      this.#textEncoder.encode(text),
    );

    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  }

  async decrypt(base64CipherText: string) {
    const arrayBuffer = await window.crypto.subtle.decrypt(
      this.#algorithm,
      await this.#key,
      Uint8Array.from(atob(base64CipherText), (m) => m.charCodeAt(0)),
    );

    return this.#textDecoder.decode(arrayBuffer);
  }
}
