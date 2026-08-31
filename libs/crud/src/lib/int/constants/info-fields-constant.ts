import type { InfoFieldModel } from '../../ext/models/info.model';

export const infoFieldsDefault = Object.freeze([
  [{ field: 'id', label: $localize`ID`, type: 'text', separator: ':' }],
  [
    {
      field: 'updatedVersion',
      label: $localize`Updated Version`,
      type: 'numeric',
      separator: ':',
    },
  ],
  [
    { field: 'createdBy', label: $localize`Created By`, type: 'text' },
    { field: 'createdAt', label: $localize`At`, type: 'datetime', format: 'medium' },
  ],
  [
    { field: 'updatedBy', label: $localize`Updated By`, type: 'text' },
    { field: 'updatedAt', label: $localize`At`, type: 'datetime', format: 'medium' },
  ],
]) as InfoFieldModel[][];
