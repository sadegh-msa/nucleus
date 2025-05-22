import { OperationStatus } from '@nucleus/common';
import {
  NuTool,
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListResponse,
  RestUpdateResponse,
} from '../../crud';

export interface ActionCommon {
  tool?: NuTool;
}

export interface ActionFailure extends ActionCommon {
  status: OperationStatus;
  message: string;
}

export interface ActionSuccess extends ActionCommon {
  status: OperationStatus;
  message?: string;
}

export interface ActionList<Query> extends ActionCommon {
  query?: Query;
}

export interface ActionListSuccess<Response> extends ActionSuccess {
  response: RestListResponse<Response>;
}

export interface ActionGet extends ActionCommon {
  query: string;
}

export interface ActionGetMutate<Request> {
  request: Request;
}

export interface ActionGetSuccess<Response> extends ActionSuccess {
  response: RestGetResponse<Response>;
}

export interface ActionAdd<Request> extends ActionCommon {
  request: Request;
}

export interface ActionAddSuccess<Response> extends ActionSuccess {
  response: RestAddResponse<Response>;
}

export interface ActionUpdate<Request> extends ActionCommon {
  query: string;
  request: Request;
}

export interface ActionUpdateSuccess<Response> extends ActionSuccess {
  response: RestUpdateResponse<Response>;
}

export interface ActionDelete extends ActionCommon {
  query: string;
}

export interface ActionDeleteSuccess extends ActionSuccess {
  response: RestDeleteResponse;
}
