import { DOCUMENT } from '@angular/common';
import { computed, inject, Service, signal } from '@angular/core';
import type { NuLang, NuLangDir } from '../types/lang.type';

@Service()
export class NuLocaleService {
  readonly #document = inject(DOCUMENT);

  readonly #htmlObserver = new MutationObserver((list) => {
    if (!list.length) {
      return;
    }

    if (list[0].attributeName === 'lang') {
      this.#lang.set(this.#getDocumentLang());
    }

    if (list[0].attributeName === 'dir') {
      this.#dir.set(this.#getDocumentDir());
    }
  });

  readonly #lang = signal<NuLang>(this.#getDocumentLang());
  readonly #dir = signal<NuLangDir>(this.#getDocumentDir());

  isLtr = computed(() => this.#dir() === 'ltr');
  isRtl = computed(() => this.#dir() === 'rtl');
  isPersian = computed(() => this.lang() === 'fa');

  get lang() {
    return this.#lang.asReadonly();
  }

  get dir() {
    return this.#dir.asReadonly();
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
    return this.#document.documentElement.lang as NuLang;
  }

  #getDocumentDir() {
    return this.#document.documentElement.dir.toLowerCase() as NuLangDir;
  }

  setLang(lang: NuLang) {
    this.#document.documentElement.lang = lang;
  }

  setDir(dir: NuLangDir) {
    this.#document.documentElement.dir = dir;
  }
}
