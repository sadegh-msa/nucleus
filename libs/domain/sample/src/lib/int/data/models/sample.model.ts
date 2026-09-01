import type { CommonFieldsModel, CrudConfigModel } from '@nucleus/crud';
import type { SampleStatusType } from '../types/sample.type';

export interface SampleDetailModel {
  id: string;
  debit: number;
  credit: number;
  description: string;
  sampleId: string;
  accountId: string;
}

export interface SampleFormModel {
  id: string;
  code: string;
  active: boolean;
  title: string;
  date: Date;
  description: string;
  status: SampleStatusType;
  details: SampleDetailModel[];
}

export type SampleModel = CommonFieldsModel & SampleFormModel;
export type SampleListModel = SampleModel[];
export type SampleAddModel = Omit<SampleFormModel, 'id'>;
export type SampleUpdateModel = SampleFormModel;
export type SampleConfigModel = CrudConfigModel<SampleModel, 'id', 'code', 'title'>;
