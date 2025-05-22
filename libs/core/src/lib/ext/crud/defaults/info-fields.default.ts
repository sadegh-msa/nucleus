import { DataType } from '@nucleus/common';
import { InfoField } from '../models/info.model';

export const infoFieldsDefault = Object.freeze([
  [{ field: 'id', label: $localize`ID`, type: DataType.Text, separator: ':' }],
  [
    {
      field: 'updatedVersion',
      label: $localize`Updated Version`,
      type: DataType.Numeric,
      separator: ':',
    },
  ],
  [
    { field: 'createdBy', label: $localize`Created By`, type: DataType.Text },
    { field: 'createdAt', label: $localize`At`, type: DataType.Datetime, format: 'medium' },
  ],
  [
    { field: 'updatedBy', label: $localize`Updated By`, type: DataType.Text },
    { field: 'updatedAt', label: $localize`At`, type: DataType.Datetime, format: 'medium' },
  ],
]) as InfoField[][];
