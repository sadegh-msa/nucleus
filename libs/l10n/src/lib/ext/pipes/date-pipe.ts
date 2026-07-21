import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DateUtils } from '../services/date-utils';

@Pipe({
  name: 'nuDate',
})
export class NuDatePipe implements PipeTransform {
  readonly #dateUtils = inject(DateUtils);

  transform(inputValue?: string | Date | null, formatStr?: string | 'distance') {
    if (!inputValue) {
      return inputValue;
    }

    const date = this.#dateUtils.convertToDate(inputValue);

    if (!date || !this.#dateUtils.isValidDate(date)) {
      return inputValue;
    }

    return formatStr === 'distance'
      ? this.#dateUtils.formatDistanceToNow(date)
      : this.#dateUtils.format(date, formatStr);
  }
}
