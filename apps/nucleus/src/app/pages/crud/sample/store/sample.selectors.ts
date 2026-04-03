import {
  createAddStoreSelector,
  createDeleteStoreSelector,
  createGetStoreSelector,
  createListStoreSelector,
  createUpdateStoreSelector,
} from '@nucleus/core';
import type { SampleStates } from './sample.states';

export const sampleSelectors = Object.freeze({
  ...createListStoreSelector<SampleStates, SampleStates['sampleList']>((s) => s.sampleList),
  ...createGetStoreSelector<SampleStates, SampleStates['sampleGet']>((s) => s.sampleGet),
  ...createAddStoreSelector<SampleStates, SampleStates['sampleAdd']>((s) => s.sampleAdd),
  ...createUpdateStoreSelector<SampleStates, SampleStates['sampleUpdate']>((s) => s.sampleUpdate),
  ...createDeleteStoreSelector<SampleStates, SampleStates['sampleDelete']>((s) => s.sampleDelete),
});
