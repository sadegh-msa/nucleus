import { inject, Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '../services';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  readonly #dateTimeService = inject(DateTimeService);

  transform(inputValue?: string | Date | null, formatStr?: string | 'distance') {
    if (!inputValue) {
      return inputValue;
    }

    const date = this.#dateTimeService.convertToDate(inputValue);

    if (!date || !this.#dateTimeService.isValidDate(date)) {
      return inputValue;
    }

    return formatStr === 'distance'
      ? this.#dateTimeService.formatDistanceToNow(date)
      : this.#dateTimeService.format(date, formatStr);
  }
}
