import type { GenericEntityModel } from '@nucleus/core';
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
