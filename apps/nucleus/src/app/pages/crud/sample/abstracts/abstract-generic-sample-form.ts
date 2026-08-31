import type { GenericFormConsumerModel } from '@nucleus/crud';
import type { SampleGenericModel } from '../models/sample-generic.model';

type ConsumerModel = GenericFormConsumerModel<SampleGenericModel>;

export abstract class AbstractGenericSampleForm {
  abstract formModel: ConsumerModel['formModel'];
  abstract form: ConsumerModel['form'];
  data!: ConsumerModel['data'];
  id!: ConsumerModel['id'];
  isBusy!: ConsumerModel['isBusy'];
  navigationState: ConsumerModel['navigationState'];
  title!: ConsumerModel['title'];
  toolbar!: ConsumerModel['toolbar'];
  onSubmit!: ConsumerModel['onSubmit'];
}
