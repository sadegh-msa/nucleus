import { Service } from '@angular/core';
import { injectNuCommonConfig } from '../providers/common-config.provider';

@Service()
export class CryptoUtils {
  readonly #textEncoder = new TextEncoder();
  readonly #textDecoder = new TextDecoder('utf-8');

  readonly #DEFAULT_ALGORITHM_NAME = 'AES-CTR';
  readonly #DEFAULT_ALGORITHM_LENGTH = 256;
  readonly #DEFAULT_SECURE_KEY = 'DFyaWAZZVnXY7dfQhogFEe3mint1xIRu';

  readonly #algorithm = (() => {
    const { algorithm, secureKey } = injectNuCommonConfig().crypto;

    return {
      name: algorithm.name || this.#DEFAULT_ALGORITHM_NAME,
      counter: this.#textEncoder.encode((secureKey || this.#DEFAULT_SECURE_KEY).slice(0, 16)),
      length: algorithm.length || this.#DEFAULT_ALGORITHM_LENGTH,
    };
  })();

  readonly #key = (() => {
    const { secureKey, algorithm } = injectNuCommonConfig().crypto;

    return window.crypto.subtle.importKey(
      'raw',
      this.#textEncoder.encode(secureKey || this.#DEFAULT_SECURE_KEY),
      algorithm.name || this.#DEFAULT_ALGORITHM_NAME,
      false,
      ['encrypt', 'decrypt'],
    );
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
