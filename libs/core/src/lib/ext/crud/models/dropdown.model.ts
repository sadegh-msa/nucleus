import { Signal } from '@angular/core';
import { ValueLabel } from './pair.model';

export interface DropdownData {
  options: Signal<ValueLabel[]>;
  icon: Signal<string>;
}
