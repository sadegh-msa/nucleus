import { createActionPermissions, createPagePaths } from '@nucleus/core';
import { SampleConfig } from './models/sample.model';

const base = 'sample';
const full = ['/', base];

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
    base,
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
