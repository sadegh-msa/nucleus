import { computed, inject, Injectable, signal } from '@angular/core';
import {
  type DateArg,
  format,
  formatDistance,
  type FormatDistanceOptions,
  type FormatOptions,
  isValid,
  type Locale,
  parse,
  type ParseOptions,
} from 'date-fns';
import {
  format as jFormat,
  formatDistance as jFormatDistance,
  parse as jParse,
} from 'date-fns-jalali';
import { enUS } from 'date-fns/locale/en-US';
import { faIR } from 'date-fns/locale/fa-IR';
import type { NuLang } from '../models';
import { NuLocaleService } from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class NuDateService {
  readonly #localeService = inject(NuLocaleService);

  readonly #DISTANCE_LIMIT = 2 * 24 * 60 * 60;
  readonly #defaultFormatStr: Record<NuLang, Record<'input' | 'output', string>> = {
    'en-US': {
      input: 'MM/dd/yyyy HH:mm',
      output: 'MMM d, yyyy HH:mm',
    },
    fa: {
      input: 'yyyy/MM/dd HH:mm',
      output: 'd MMMM yyyy HH:mm',
    },
  };
  readonly #locales: Record<NuLang, Locale> = {
    'en-US': enUS,
    fa: faIR,
  };

  readonly #now = signal(new Date());
  readonly now = computed(() => new Date(this.#now().getTime()));
  readonly locale = computed(() => this.#locales[this.#localeService.lang()]);

  get defaultInputFormatStr() {
    return this.#defaultFormatStr[this.#localeService.lang()].input;
  }

  get defaultOutputFormatStr() {
    return this.#defaultFormatStr[this.#localeService.lang()].output;
  }

  isValidDate(inputValue: unknown) {
    return isValid(inputValue);
  }

  convertToDate(inputValue: string | Date) {
    let date: Date | null = null;

    if (inputValue instanceof Date) {
      date = new Date(inputValue.getTime());
    } else if (inputValue?.length) {
      const zulu = 'Z';

      if (inputValue.at(-1)?.toUpperCase() === zulu) {
        date = new Date(inputValue);
      } else {
        date = new Date(inputValue + zulu);
      }
    }

    return date;
  }

  parse(
    dateStr: string,
    formatStr = this.defaultInputFormatStr,
    referenceDate: DateArg<Date> = this.now(),
    options?: ParseOptions<Date>,
  ) {
    return this.#localeService.isPersian()
      ? jParse(dateStr, formatStr, referenceDate, options)
      : parse(dateStr, formatStr, referenceDate, options);
  }

  format(date: DateArg<Date>, formatStr = this.defaultOutputFormatStr, options?: FormatOptions) {
    return this.#localeService.isPersian()
      ? jFormat(date, formatStr, options)
      : format(date, formatStr, options);
  }

  formatDistanceToNow(inputValue: string | Date) {
    const laterDate = this.convertToDate(inputValue);

    if (!laterDate) {
      return inputValue;
    }

    const earlierDate = this.now();
    const diff = earlierDate.getTime() - laterDate.getTime();
    const diffInSeconds = Math.abs(Math.floor(diff / 1000));

    if (diffInSeconds < this.#DISTANCE_LIMIT) {
      const options: FormatDistanceOptions = {
        addSuffix: true,
        locale: this.locale(),
      };

      return this.#localeService.isPersian()
        ? jFormatDistance(laterDate, earlierDate, options)
        : formatDistance(laterDate, earlierDate, options);
    }

    return this.format(laterDate);
  }
}
