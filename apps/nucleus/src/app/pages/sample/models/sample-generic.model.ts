import { GenericEntity, GenericFormConsumer, GenericListConsumer } from '@nucleus/core';
import { SampleStates } from '../store';
import {
  Sample,
  SampleAdd,
  SampleConfig,
  SampleForm,
  SampleList,
  SampleTypedForm,
  SampleUpdate
} from './sample.model';

export type SampleGeneric = GenericEntity<
  Sample, SampleList, SampleAdd,
  SampleUpdate, SampleForm, SampleTypedForm,
  SampleStates, SampleConfig
>

export type GenericSampleList = GenericListConsumer<SampleGeneric>;
export type GenericSampleForm = GenericFormConsumer<SampleGeneric>;
