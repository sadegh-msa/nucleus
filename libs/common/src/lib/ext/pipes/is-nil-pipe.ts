import { Pipe, type PipeTransform } from '@angular/core';
import { isNil } from '../utils/data-util';

@Pipe({ name: 'isNil' })
export class IsNil implements PipeTransform {
  transform(value: unknown): boolean {
    return isNil(value);
  }
}
