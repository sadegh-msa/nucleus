import { createActionPermissions, createPagePaths } from '@nucleus/core';
import type { SampleConfig } from './models/sample.model';

const prefix = 'crud';
const entity = 'sample';
const full = ['/', prefix, entity];

export const sampleConfig = Object.freeze({
  info: {
    title: 'Sample',
    icon: 'grid-1',
  },
  field: {
    id: 'id',
    code: 'code',
    title: 'title',
    dates: ['date', 'createdAt', 'updatedAt'],
  },
  path: {
    base: `${prefix}/${entity}`,
    full,
    page: createPagePaths(full),
  },
  permission: {
    action: createActionPermissions(full),
  },
  rest: {
    endpoint: 'samples',
  },
} as SampleConfig);
