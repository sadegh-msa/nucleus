import type { DataType } from '@nucleus/common';

export interface InfoFieldModel {
  field: string;
  label: string;
  type?: DataType;
  format?: string;
  separator?: string;
}
