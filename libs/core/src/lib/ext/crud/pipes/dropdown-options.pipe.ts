import { Pipe, PipeTransform } from '@angular/core';
import { ValueLabel } from '../models/pair.model';

const optionCollection = {
  yesNo: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
} as Record<string, ValueLabel[]>;

@Pipe({
  name: 'dropdownOptions',
})
export class DropdownOptionsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): ValueLabel[] {
    return optionCollection[value] || [];
  }
}
