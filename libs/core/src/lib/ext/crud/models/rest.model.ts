import type { ListOrderType } from '../types/list.type';
import type { PaginationModel } from './pagination.model';

export interface RestMethodParamsModel {
  endpoint: string;
  dateFields: string[];
}

export interface RestResponseModel<Data, Control> {
  data: Data;
  control: Control;
}

export interface RestResponseControlModel {
  message?: string;
}

export interface RestErrorModel {
  code: number;
  method: string;
  path: string;
  reason: string;
  timestamp: string;
}

export interface RestListQueryModel {
  page?: number;
  rows?: number;
  order?: Record<string, ListOrderType>;
  filter?: unknown;
  fields?: string[];
}

export interface RestListResponseControlModel extends RestResponseControlModel {
  pagination: PaginationModel;
}

export type RestListResponseModel<Response> = RestResponseModel<
  Response,
  RestListResponseControlModel
>;
export type RestGetResponseModel<Response> = RestResponseModel<Response, RestResponseControlModel>;
export type RestAddResponseModel<Response> = RestResponseModel<Response, RestResponseControlModel>;
export type RestUpdateResponseModel<Response> = RestResponseModel<
  Response,
  RestResponseControlModel
>;
export type RestDeleteResponseModel = RestResponseModel<string, RestResponseControlModel>;
