import type { OperationStatus } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type {
  RestAddResponseModel,
  RestDeleteResponseModel,
  RestGetResponseModel,
  RestListResponseModel,
  RestUpdateResponseModel,
} from '../../crud/models/rest.model';
import type { NuToolModel } from '../../crud/models/toolbar.model';

export interface ListStateModel<Query, Response> {
  tool?: NuToolModel;
  query: Query;
  response: RestListResponseModel<Response[]>;
  message: string;
  status: OperationStatus;
}

export interface GetStateModel<Response> {
  tool?: NuToolModel;
  query: string;
  response: RestGetResponseModel<Response>;
  message: string;
  status: OperationStatus;
}

export interface AddStateModel<Request, Response> {
  tool?: NuToolModel;
  request: Request;
  response: RestAddResponseModel<Response>;
  message: string;
  status: OperationStatus;
}

export interface UpdateStateModel<Request, Response> {
  tool?: NuToolModel;
  query: string;
  request: Request;
  response: RestUpdateResponseModel<Response>;
  message: string;
  status: OperationStatus;
}

export interface DeleteStateModel {
  tool?: NuToolModel;
  query: string;
  response: RestDeleteResponseModel;
  message: string;
  status: OperationStatus;
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
