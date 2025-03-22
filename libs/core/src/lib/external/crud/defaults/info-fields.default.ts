import { DataType } from '@nucleus/common';
import { InfoField } from '../models/info.model';

export const infoFieldsDefault = Object.freeze([
  [{ field: 'id', label: 'ID:', type: DataType.Text }],
  [{ field: 'updatedVersion', label: 'Updated Version:', type: DataType.Numeric }],
  [
    { field: 'createdBy', label: 'Created By', type: DataType.Text },
    { field: 'createdAt', label: 'At', type: DataType.Datetime, format: 'medium' }
  ],
  [
    { field: 'updatedBy', label: 'Updated By', type: DataType.Text, },
    { field: 'updatedAt', label: 'At', type: DataType.Datetime, format: 'medium' }
  ]
]) as InfoField[][];
