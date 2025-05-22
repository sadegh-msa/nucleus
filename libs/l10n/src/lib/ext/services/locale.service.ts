import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable } from '@angular/core';
import type { NuLang } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NuLocaleService {
  readonly #document = inject(DOCUMENT);

  lang = computed(() => this.#document.documentElement.lang as NuLang);
  isRtl = computed(() => this.#document.documentElement.dir.toLowerCase() === 'rtl');
  isPersian = computed(() => this.lang() === 'fa');
}
