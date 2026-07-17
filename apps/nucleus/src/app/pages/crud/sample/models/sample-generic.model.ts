import type {
  GenericEntityModel,
  GenericFormConsumerModel,
  GenericListConsumerModel,
} from '@nucleus/core';
import type {
  SampleAddModel,
  SampleConfigModel,
  SampleFormModel,
  SampleListModel,
  SampleModel,
  SampleTypedFormModel,
  SampleUpdateModel,
} from './sample.model';

export type SampleGenericModel = GenericEntityModel<
  SampleModel,
  SampleListModel,
  SampleAddModel,
  SampleUpdateModel,
  SampleFormModel,
  SampleTypedFormModel,
  SampleConfigModel
>;

export type GenericSampleListModel = GenericListConsumerModel<SampleGenericModel>;
export type GenericSampleFormModel = GenericFormConsumerModel<SampleGenericModel>;
