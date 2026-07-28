import type { GenericListConsumerModel } from '@nucleus/core';
import type { SampleGenericModel } from '../models/sample-generic.model';

type ListModel = GenericListConsumerModel<SampleGenericModel>;

export abstract class AbstractGenericSampleList {
  isDataLoading!: ListModel['isDataLoading'];
  data!: ListModel['data'];
  pagination!: ListModel['pagination'];
  selectedRecords!: ListModel['selectedRecords'];
  toolbar!: ListModel['toolbar'];
  changeSelection!: ListModel['changeSelection'];
}
