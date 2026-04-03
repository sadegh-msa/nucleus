import { createAddStoreActionGroup, createDeleteStoreActionGroup, createGetStoreActionGroup, createListStoreActionGroup, createUpdateStoreActionGroup, type RestListQuery } from '@nucleus/core';
import type { Sample, SampleAdd, SampleList, SampleUpdate } from '../models/sample.model';

const SOURCE = 'Sample';

export const sampleListActions = createListStoreActionGroup<
  RestListQuery,
  SampleList
>(SOURCE);
export const sampleGetActions = createGetStoreActionGroup<Sample>(SOURCE);
export const sampleAddActions = createAddStoreActionGroup<SampleAdd, Sample>(SOURCE);
export const sampleUpdateActions = createUpdateStoreActionGroup<SampleUpdate, Sample>(
  SOURCE,
);
export const sampleDeleteActions = createDeleteStoreActionGroup(SOURCE);

export const sampleActions = {
  ...sampleListActions,
  ...sampleGetActions,
  ...sampleAddActions,
  ...sampleUpdateActions,
  ...sampleDeleteActions,
};
