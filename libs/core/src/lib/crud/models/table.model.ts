import { Observable } from 'rxjs';
import { DataType } from '../../common';
import { NuTool, NuToolEvent } from './toolbar.model';

export interface NuTableColumn {
  field: string;
  label: string;
  tooltip?: string;
  type?: DataType;
  format?: string;
  isHidden?: boolean;
  styleClass?: string;
}

export interface NuTable {
  columns: NuTableColumn[];
  tools: NuTool[];
  events$?: Observable<NuToolEvent>;
}
