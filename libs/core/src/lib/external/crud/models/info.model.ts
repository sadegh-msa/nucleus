import { DataType } from '@nucleus/common';

export interface InfoField {
  field: string;
  label: string;
  type?: DataType;
  format?: string;
}
