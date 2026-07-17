import { Pipe, type PipeTransform } from '@angular/core';
import type { ValueLabelModel } from '../models/pair.model';

const optionCollection = {
  yesNo: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
} as Record<string, ValueLabelModel[]>;

@Pipe({
  name: 'dropdownOptions',
})
export class DropdownOptionsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): ValueLabelModel[] {
    return optionCollection[value] || [];
  }
}
