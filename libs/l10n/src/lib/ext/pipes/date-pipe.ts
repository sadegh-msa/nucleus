import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DateUtil } from '../services/date-util';

@Pipe({
  name: 'nuDate',
})
export class NuDatePipe implements PipeTransform {
  readonly #dateUtil = inject(DateUtil);

  transform(inputValue?: string | Date | null, formatStr?: string | 'distance') {
    if (!inputValue) {
      return inputValue;
    }

    const date = this.#dateUtil.convertToDate(inputValue);

    if (!date || !this.#dateUtil.isValidDate(date)) {
      return inputValue;
    }

    return formatStr === 'distance'
      ? this.#dateUtil.formatDistanceToNow(date)
      : this.#dateUtil.format(date, formatStr);
  }
}
