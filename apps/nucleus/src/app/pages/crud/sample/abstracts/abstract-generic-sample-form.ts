import type { GenericFormConsumerModel } from '@nucleus/core';
import type { SampleGenericModel } from '../models/sample-generic.model';

type FormModel = GenericFormConsumerModel<SampleGenericModel>;

export abstract class AbstractGenericSampleForm {
  data!: FormModel['data'];
  title!: FormModel['title'];
  isSubmitted!: FormModel['isSubmitted'];
  isSubmitting!: FormModel['isSubmitting'];
  save!: FormModel['save'];
  formControlHasError!: FormModel['formControlHasError'];
  toolbar!: FormModel['toolbar'];
  navigationState: FormModel['navigationState'];
}
