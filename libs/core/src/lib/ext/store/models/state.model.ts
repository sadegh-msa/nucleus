import type { OperationStatus } from '@nucleus/common';
import type { RestListResponse } from '../../crud/models/rest.model'; // Possibility of circular dependency
import type { NuTool } from '../../crud/models/toolbar.model'; // Possibility of circular dependency

export interface CommonState {
  type: string;
  message: string;
  status: OperationStatus;
  tool?: NuTool;
}

export interface ListState<Query, Response> extends CommonState {
  query: Query;
  response: RestListResponse<Response>;
}

export interface GetState<Response> extends CommonState {
  query: string;
  response: Response;
}

export interface AddState<Request, Response> extends CommonState {
  request: Request;
  response: Response;
}

export interface UpdateState<Request, Response> extends CommonState {
  query: string;
  request: Request;
  response: Response;
}

export interface DeleteState extends CommonState {
  query: string;
  response: string;
}
