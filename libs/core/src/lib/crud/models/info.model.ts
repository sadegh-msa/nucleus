import { DataType } from '../../common';

export interface InfoField {
  field: string;
  label: string;
  type?: DataType;
  format?: string;
}