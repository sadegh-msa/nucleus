import type { GenericEntityModel } from '@nucleus/crud';
import type {
  SampleAddModel,
  SampleConfigModel,
  SampleFormModel,
  SampleListModel,
  SampleModel,
  SampleUpdateModel,
} from './sample.model';

export type SampleGenericModel = GenericEntityModel<
  SampleModel,
  SampleListModel,
  SampleAddModel,
  SampleUpdateModel,
  SampleFormModel,
  SampleConfigModel
>;
