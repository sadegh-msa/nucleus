import type { NgClass } from '@angular/common';
import type { DataType } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type { ToolEventModel, ToolModel } from './toolbar.model';

export interface TableColumnModel {
  field: string;
  label: string;
  tooltip?: string;
  type?: DataType;
  format?: string;
  isHidden?: boolean;
  ngClass?: NgClass['ngClass'];
}

export interface TableModel {
  columns: TableColumnModel[];
  tools: ToolModel[];
  events$?: Observable<ToolEventModel>;
}
