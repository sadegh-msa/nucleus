import { Pipe, type PipeTransform } from '@angular/core';
import { isNotEmpty } from '../utils/data-util';

@Pipe({ name: 'isNotEmpty' })
export class IsNotEmpty implements PipeTransform {
  transform(value: unknown): boolean {
    return isNotEmpty(value);
  }
}
