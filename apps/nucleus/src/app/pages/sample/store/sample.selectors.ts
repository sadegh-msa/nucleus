import { StoreSelectorCreator } from '@nucleus/core';
import { SampleStates } from './sample.states';

export const sampleSelectors = Object.freeze({
  ...StoreSelectorCreator.createList<SampleStates, SampleStates['sampleList']>(s => s.sampleList),
  ...StoreSelectorCreator.createGet<SampleStates, SampleStates['sampleGet']>(s => s.sampleGet),
  ...StoreSelectorCreator.createAdd<SampleStates, SampleStates['sampleAdd']>(s => s.sampleAdd),
  ...StoreSelectorCreator.createUpdate<SampleStates, SampleStates['sampleUpdate']>(s => s.sampleUpdate),
  ...StoreSelectorCreator.createDelete<SampleStates, SampleStates['sampleDelete']>(s => s.sampleDelete)
});
