import type { Signal } from '@angular/core';
import type { ValueLabelModel } from './pair.model';

export interface DropdownDataModel {
  options: Signal<ValueLabelModel[]>;
  icon: Signal<string>;
}
