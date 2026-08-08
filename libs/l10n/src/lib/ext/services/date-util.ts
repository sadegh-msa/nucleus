import { computed, inject, Service } from '@angular/core';
import {
  type DateArg,
  type FormatDistanceOptions,
  type FormatOptions,
  format,
  formatDistance,
  isValid,
  type Locale,
  type ParseOptions,
  parse,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { faIR } from 'date-fns/locale/fa-IR';
import {
  format as jFormat,
  formatDistance as jFormatDistance,
  parse as jParse,
} from 'date-fns-jalali';
import { l10nInternalConfig } from '../../int/configs';
import type { NuLang } from '../types/lang.type';
import { LocaleUtil } from './locale-util';

const dateConfig = l10nInternalConfig.date;

@Service()
export class DateUtil {
  readonly #localeUtil = inject(LocaleUtil);

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

  readonly now = computed(() => new Date());
  readonly locale = computed(() => this.#locales[this.#localeUtil.lang()]);
  readonly defaultInputFormatStr = computed(
    () => this.#defaultFormatStr[this.#localeUtil.lang()].input,
  );
  readonly defaultOutputFormatStr = computed(
    () => this.#defaultFormatStr[this.#localeUtil.lang()].output,
  );

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
    formatStr = this.defaultInputFormatStr(),
    referenceDate: DateArg<Date> = this.now(),
    options?: ParseOptions<Date>,
  ) {
    return this.#localeUtil.isPersian()
      ? jParse(dateStr, formatStr, referenceDate, options)
      : parse(dateStr, formatStr, referenceDate, options);
  }

  format(date: DateArg<Date>, formatStr = this.defaultOutputFormatStr(), options?: FormatOptions) {
    return this.#localeUtil.isPersian()
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

    if (diffInSeconds < dateConfig.distanceLimit) {
      const options: FormatDistanceOptions = {
        addSuffix: true,
        locale: this.locale(),
      };

      return this.#localeUtil.isPersian()
        ? jFormatDistance(laterDate, earlierDate, options)
        : formatDistance(laterDate, earlierDate, options);
    }

    return this.format(laterDate);
  }
}
