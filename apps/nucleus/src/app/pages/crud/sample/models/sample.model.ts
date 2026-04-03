import { CommonFields, CrudConfig, TypedForm } from '@nucleus/core';
import { SampleStatus } from '../enums/sample-status.enum';

export interface SampleDetail {
  id: string;
  debit: number;
  credit: number;
  description: string;
  sampleId: string;
  accountId: string;
  divisionId: string;
}

export interface SampleForm {
  id: string;
  code: string;
  active: boolean;
  title: string;
  date: Date;
  description: string;
  status: SampleStatus;
  details: SampleDetail[];
  divisionId: string;
}

export type Sample = CommonFields & SampleForm;
export type SampleList = Sample[];
export type SampleAdd = Omit<SampleForm, 'id'>;
export type SampleUpdate = SampleForm;
export type SampleTypedForm = TypedForm<SampleForm>;
export type SampleConfig = CrudConfig<Sample, 'id', 'code', 'title'>;
