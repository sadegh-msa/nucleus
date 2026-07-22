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

type GenericSampleListModel = GenericListConsumerModel<SampleGenericModel>;
type GenericSampleFormModel = GenericFormConsumerModel<SampleGenericModel>;

export abstract class AbstractGenericSampleList {
  isDataLoading!: GenericSampleListModel['isDataLoading'];
  data!: GenericSampleListModel['data'];
  pagination!: GenericSampleListModel['pagination'];
  selectedRecords!: GenericSampleListModel['selectedRecords'];
  toolbar!: GenericSampleListModel['toolbar'];
  changeSelection!: GenericSampleListModel['changeSelection'];
}

export abstract class AbstractGenericSampleForm {
  data!: GenericSampleFormModel['data'];
  title!: GenericSampleFormModel['title'];
  isSubmitted!: GenericSampleFormModel['isSubmitted'];
  isSubmitting!: GenericSampleFormModel['isSubmitting'];
  save!: GenericSampleFormModel['save'];
  formControlHasError!: GenericSampleFormModel['formControlHasError'];
  toolbar!: GenericSampleFormModel['toolbar'];
  navigationState: GenericSampleFormModel['navigationState'];
}
