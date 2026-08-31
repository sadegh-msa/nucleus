import type { OperationStatusType } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type {
  RestAddResponseModel,
  RestDeleteResponseModel,
  RestGetResponseModel,
  RestListResponseModel,
  RestUpdateResponseModel,
} from '../models/rest.model';
import type { ToolModel } from '../models/toolbar.model';

export interface ListStateModel<Query, Response> {
  tool?: ToolModel;
  query: Query;
  response: RestListResponseModel<Response[]>;
  message: string;
  status: OperationStatusType;
}

export interface GetStateModel<Response> {
  tool?: ToolModel;
  query: string;
  response: RestGetResponseModel<Response>;
  message: string;
  status: OperationStatusType;
}

export interface AddStateModel<Request, Response> {
  tool?: ToolModel;
  request: Request;
  response: RestAddResponseModel<Response>;
  message: string;
  status: OperationStatusType;
}

export interface UpdateStateModel<Request, Response> {
  tool?: ToolModel;
  query: string;
  request: Request;
  response: RestUpdateResponseModel<Response>;
  message: string;
  status: OperationStatusType;
}

export interface DeleteStateModel {
  tool?: ToolModel;
  query: string;
  response: RestDeleteResponseModel;
  message: string;
  status: OperationStatusType;
}

export interface CrudStoreStateModel<Query, Request, Response> {
  list: ListStateModel<Query, Response>;
  get: GetStateModel<Response>;
  add: AddStateModel<Request, Response>;
  update: UpdateStateModel<Request, Response>;
  delete: DeleteStateModel;
}

export interface CrudRestMethodsModel<Query, Request, Response> {
  list: (query?: Query) => Observable<RestListResponseModel<Response[]>>;
  get: (id: string) => Observable<RestGetResponseModel<Response>>;
  add: (request: Request) => Observable<RestAddResponseModel<Response>>;
  update: (id: string, request: Request) => Observable<RestUpdateResponseModel<Response>>;
  delete: (id: string) => Observable<RestDeleteResponseModel>;
}
