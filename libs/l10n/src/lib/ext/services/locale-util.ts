import { DOCUMENT } from '@angular/common';
import { computed, inject, Service, signal } from '@angular/core';
import type { LangDirType, LangType } from '../types/lang.type';

@Service()
export class LocaleUtil {
  readonly #document = inject(DOCUMENT);

  readonly #htmlObserver = new MutationObserver((list) => {
    for (const mutation of list) {
      if (mutation.attributeName === 'lang') {
        this.#lang.set(this.#getDocumentLang());
      }

      if (mutation.attributeName === 'dir') {
        this.#dir.set(this.#getDocumentDir());
      }
    }
  });

  readonly #lang = signal<LangType>(this.#getDocumentLang());
  readonly #dir = signal<LangDirType>(this.#getDocumentDir());

  isLtr = computed(() => this.#dir() === 'ltr');
  isRtl = computed(() => this.#dir() === 'rtl');
  isPersian = computed(() => this.lang() === 'fa');

  get lang() {
    return this.#lang;
  }

  get dir() {
    return this.#dir;
  }

  constructor() {
    this.#htmlObserver.observe(this.#getHtmlElement(), {
      attributes: true,
      childList: false,
      subtree: false,
      attributeFilter: ['lang', 'dir'],
    });
  }

  #getHtmlElement() {
    return this.#document.documentElement;
  }

  #getDocumentLang() {
    return this.#document.documentElement.lang as LangType;
  }

  #getDocumentDir() {
    return this.#document.documentElement.dir.toLowerCase() as LangDirType;
  }

  setLang(lang: LangType) {
    this.#document.documentElement.lang = lang;
  }

  setDir(dir: LangDirType) {
    this.#document.documentElement.dir = dir;
  }
}
