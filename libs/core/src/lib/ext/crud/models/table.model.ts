import type { NgClass } from '@angular/common';
import type { DataType } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type { NuTool, NuToolEvent } from './toolbar.model';

export interface NuTableColumn {
  field: string;
  label: string;
  tooltip?: string;
  type?: DataType;
  format?: string;
  isHidden?: boolean;
  ngClass?: NgClass['ngClass'];
}

export interface NuTable {
  columns: NuTableColumn[];
  tools: NuTool[];
  events$?: Observable<NuToolEvent>;
}
