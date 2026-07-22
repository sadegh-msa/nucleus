import type { CommonFieldsModel, CrudConfigModel, TypedFormModel } from '@nucleus/core';
import type { SampleStatus } from '../enums/sample-status.enum';

export interface SampleDetailModel {
  id: string;
  debit: number;
  credit: number;
  description: string;
  sampleId: string;
  accountId: string;
  divisionId: string;
}

export interface SampleFormModel {
  id: string;
  code: string;
  active: boolean;
  title: string;
  date: Date;
  description: string;
  status: SampleStatus;
  details: SampleDetailModel[];
  divisionId: string;
}

export type SampleModel = CommonFieldsModel & SampleFormModel;
export type SampleListModel = SampleModel[];
export type SampleAddModel = Omit<SampleFormModel, 'id'>;
export type SampleUpdateModel = SampleFormModel;
export type SampleTypedFormModel = TypedFormModel<SampleFormModel>;
export type SampleConfigModel = CrudConfigModel<SampleModel, 'id', 'code', 'title'>;
