import {
  createAddStoreReducer,
  createDeleteStoreReducer,
  createGetStoreReducer,
  createListStoreReducer,
  createUpdateStoreReducer,
  type RestListQuery,
} from '@nucleus/core';
import type { Sample, SampleAdd, SampleList, SampleUpdate } from '../models/sample.model';
import {
  sampleAddActions,
  sampleDeleteActions,
  sampleGetActions,
  sampleListActions,
  sampleUpdateActions,
} from './sample.actions';
import type { SampleStates } from './sample.states';

export const sampleReducers = {
  sampleList: createListStoreReducer<SampleStates['sampleList'], RestListQuery, SampleList>(
    sampleListActions,
  ).list,
  sampleGet: createGetStoreReducer<SampleStates['sampleGet'], Sample>(sampleGetActions).get,
  sampleAdd: createAddStoreReducer<SampleStates['sampleAdd'], SampleAdd, Sample>(sampleAddActions)
    .add,
  sampleUpdate: createUpdateStoreReducer<SampleStates['sampleUpdate'], SampleUpdate, Sample>(
    sampleUpdateActions,
  ).update,
  sampleDelete: createDeleteStoreReducer<SampleStates['sampleDelete']>(sampleDeleteActions).delete,
};
