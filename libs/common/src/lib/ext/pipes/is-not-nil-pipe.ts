import { Pipe, type PipeTransform } from '@angular/core';
import { isNotNil } from '../utils/data-util';

@Pipe({ name: 'isNotNil' })
export class IsNotNil implements PipeTransform {
  transform(value: unknown): boolean {
    return isNotNil(value);
  }
}
