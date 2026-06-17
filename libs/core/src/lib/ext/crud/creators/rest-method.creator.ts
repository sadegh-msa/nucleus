import { convertDateStrings } from '@nucleus/common';
import type { GenericEntity } from '../models/generic.model';
import type { RestServiceParams } from '../models/rest-service.model';
import type {
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListQuery,
  RestListResponse,
  RestUpdateResponse
} from '../models/rest.model';

function convertDateOperator<Response>(dateFields: string[]) {
  return convertDateStrings<Response>(...(dateFields || []).map((f: string) => `data.${f}`));
}

export function createListRestMethod<T extends GenericEntity>({ service, endpoint }: RestServiceParams) {
  type Query = RestListQuery;
  type Response = RestListResponse<T['list']>;

  return (query?: Query) => {
    const url = service.createUrl(endpoint);
    const options = { params: service.createListHttpParams(query) };

    return service.httpClient.get<Response>(url, options);
  };
}

export function createGetRestMethod<T extends GenericEntity>({
  service,
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Query = string;
  type Response = RestGetResponse<T['full']>;

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.get<Response>(url).pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createAddRestMethod<T extends GenericEntity>({
  service,
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Request = T['add'];
  type Response = RestAddResponse<T['full']>;

  return (request: Request) => {
    const url = service.createUrl(endpoint);
    return service.httpClient
      .post<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createUpdateRestMethod<T extends GenericEntity>({
  service,
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Request = T['update'];
  type Response = RestUpdateResponse<T['full']>;

  return (id: string, request: Request) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient
      .patch<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createDeleteRestMethod<T extends GenericEntity>({ service, endpoint }: RestServiceParams) {
  type Query = string;
  type Response = RestDeleteResponse;

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.delete<Response>(url);
  };
}
