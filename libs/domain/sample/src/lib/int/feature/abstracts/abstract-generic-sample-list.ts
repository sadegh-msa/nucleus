import type { GenericListConsumerModel } from '@nucleus/crud';
import type { SampleGenericModel } from '../../data/models/sample-generic.model';

type ListModel = GenericListConsumerModel<SampleGenericModel>;

export abstract class AbstractGenericSampleList {
  isBusy!: ListModel['isBusy'];
  data!: ListModel['data'];
  pagination!: ListModel['pagination'];
  selectedRecords!: ListModel['selectedRecords'];
  toolbar!: ListModel['toolbar'];
  changeSelection!: ListModel['changeSelection'];
}
