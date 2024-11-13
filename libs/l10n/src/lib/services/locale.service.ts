import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable } from '@angular/core';
import { Lang } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  readonly #document = inject(DOCUMENT);

  lang = computed(() => this.#document.documentElement.lang as Lang);
  isRtl = computed(() => this.#document.documentElement.dir.toLowerCase() === 'rtl');
  isPersian = computed(() => this.lang() === 'fa');
}
