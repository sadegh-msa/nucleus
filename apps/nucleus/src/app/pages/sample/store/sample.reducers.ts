import { RestListQuery, StoreReducerCreator } from '@nucleus/core';
import { Sample, SampleAdd, SampleList, SampleUpdate } from '../models/sample.model';
import {
  sampleAddActions,
  sampleDeleteActions,
  sampleGetActions,
  sampleListActions,
  sampleUpdateActions
} from './sample.actions';
import { SampleStates } from './sample.states';


export const sampleReducers = {
  sampleList: (StoreReducerCreator.createList<SampleStates['sampleList'], RestListQuery, SampleList>(sampleListActions)).list,
  sampleGet: (StoreReducerCreator.createGet<SampleStates['sampleGet'], Sample>(sampleGetActions)).get,
  sampleAdd: (StoreReducerCreator.createAdd<SampleStates['sampleAdd'], SampleAdd, Sample>(sampleAddActions)).add,
  sampleUpdate: (StoreReducerCreator.createUpdate<SampleStates['sampleUpdate'], SampleUpdate, Sample>(sampleUpdateActions)).update,
  sampleDelete: (StoreReducerCreator.createDelete<SampleStates['sampleDelete']>(sampleDeleteActions)).delete
};
