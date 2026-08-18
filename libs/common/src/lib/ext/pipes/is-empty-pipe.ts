import { Pipe, type PipeTransform } from '@angular/core';
import { isEmpty } from '../utils/data-util';

@Pipe({ name: 'isEmpty' })
export class IsEmpty implements PipeTransform {
  transform(value: unknown): boolean {
    return isEmpty(value);
  }
}
