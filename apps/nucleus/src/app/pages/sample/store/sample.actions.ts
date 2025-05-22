import { RestListQuery, StoreActionCreator } from '@nucleus/core';
import { Sample, SampleAdd, SampleList, SampleUpdate } from '../models/sample.model';

const SOURCE = 'Sample';

export const sampleListActions = StoreActionCreator.createListGroup<RestListQuery, SampleList>(
  SOURCE,
);
export const sampleGetActions = StoreActionCreator.createGetGroup<Sample>(SOURCE);
export const sampleAddActions = StoreActionCreator.createAddGroup<SampleAdd, Sample>(SOURCE);
export const sampleUpdateActions = StoreActionCreator.createUpdateGroup<SampleUpdate, Sample>(
  SOURCE,
);
export const sampleDeleteActions = StoreActionCreator.createDeleteGroup(SOURCE);

export const sampleActions = {
  ...sampleListActions,
  ...sampleGetActions,
  ...sampleAddActions,
  ...sampleUpdateActions,
  ...sampleDeleteActions,
};
