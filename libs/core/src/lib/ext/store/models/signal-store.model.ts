import type { OperationStatus } from '@nucleus/common';
import type { Observable } from 'rxjs';
import type {
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListResponse,
  RestUpdateResponse,
} from '../../crud/models/rest.model';
import type { NuTool } from '../../crud/models/toolbar.model';

export interface ListState<Query, Response> {
  tool?: NuTool;
  query: Query;
  response: RestListResponse<Response[]>;
  message: string;
  status: OperationStatus;
}

export interface GetState<Response> {
  tool?: NuTool;
  query: string;
  response: RestGetResponse<Response>;
  message: string;
  status: OperationStatus;
}

export interface AddState<Request, Response> {
  tool?: NuTool;
  request: Request;
  response: RestAddResponse<Response>;
  message: string;
  status: OperationStatus;
}

export interface UpdateState<Request, Response> {
  tool?: NuTool;
  query: string;
  request: Request;
  response: RestUpdateResponse<Response>;
  message: string;
  status: OperationStatus;
}

export interface DeleteState {
  tool?: NuTool;
  query: string;
  response: RestDeleteResponse;
  message: string;
  status: OperationStatus;
}

export interface CrudStoreState<Query, Request, Response> {
  list: ListState<Query, Response>;
  get: GetState<Response>;
  add: AddState<Request, Response>;
  update: UpdateState<Request, Response>;
  delete: DeleteState;
}

export interface CrudRestMethods<Query, Request, Response> {
  list: (query?: Query) => Observable<RestListResponse<Response[]>>;
  get: (id: string) => Observable<RestGetResponse<Response>>;
  add: (request: Request) => Observable<RestAddResponse<Response>>;
  update: (id: string, request: Request) => Observable<RestUpdateResponse<Response>>;
  delete: (id: string) => Observable<RestDeleteResponse>;
}
