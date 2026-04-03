import type { Signal } from '@angular/core';
import type { ValueLabel } from './pair.model';

export interface DropdownData {
  options: Signal<ValueLabel[]>;
  icon: Signal<string>;
}
