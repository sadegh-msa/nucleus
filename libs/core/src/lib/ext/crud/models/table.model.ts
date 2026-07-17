import type { NgClass } from '@angular/common';
import type { DataType } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type { NuToolEventModel, NuToolModel } from './toolbar.model';

export interface NuTableColumnModel {
  field: string;
  label: string;
  tooltip?: string;
  type?: DataType;
  format?: string;
  isHidden?: boolean;
  ngClass?: NgClass['ngClass'];
}

export interface NuTableModel {
  columns: NuTableColumnModel[];
  tools: NuToolModel[];
  events$?: Observable<NuToolEventModel>;
}
