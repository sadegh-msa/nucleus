import { Observable } from 'rxjs';
import { DataType } from '../../common';
import { ScrTool, ScrToolEvent } from './toolbar.model';

export interface ScrTableColumn {
  field: string;
  label: string;
  tooltip?: string;
  type?: DataType;
  format?: string;
  isHidden?: boolean;
  styleClass?: string;
}

export interface ScrTable {
  columns: ScrTableColumn[];
  tools: ScrTool[];
  events$?: Observable<ScrToolEvent>;
}
