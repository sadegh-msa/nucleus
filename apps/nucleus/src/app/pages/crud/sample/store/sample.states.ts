import type {
  AddState,
  DeleteState,
  GetState,
  ListState,
  RestListQuery,
  UpdateState,
} from '@nucleus/core';
import type { Sample, SampleAdd, SampleList, SampleUpdate } from '../models/sample.model';

export interface SampleStates {
  sampleList: ListState<RestListQuery, SampleList>;
  sampleGet: GetState<Sample>;
  sampleAdd: AddState<SampleAdd, Sample>;
  sampleUpdate: UpdateState<SampleUpdate, Sample>;
  sampleDelete: DeleteState;
}
