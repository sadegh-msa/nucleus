import type { ListOrder } from '../enums/list-order.enum';
import type { Pagination } from './pagination.model';

export interface RestResponse<Data, Control> {
  data: Data;
  control: Control;
}

export interface RestResponseControl {
  message?: string;
}

export interface RestError {
  code: number;
  method: string;
  path: string;
  reason: string;
  timestamp: string;
}

export interface RestListQuery {
  page?: number;
  rows?: number;
  order?: Record<string, ListOrder>;
  filter?: unknown;
  fields?: string[];
}

export interface RestListResponseControl extends RestResponseControl {
  pagination: Pagination;
}

export type RestListResponse<Response> = RestResponse<Response, RestListResponseControl>;
export type RestGetResponse<Response> = RestResponse<Response, RestResponseControl>;
export type RestAddResponse<Response> = RestResponse<Response, RestResponseControl>;
export type RestUpdateResponse<Response> = RestResponse<Response, RestResponseControl>;
export type RestDeleteResponse = RestResponse<string, RestResponseControl>;
