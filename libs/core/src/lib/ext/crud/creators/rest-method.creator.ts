import { inject } from '@angular/core';
import { convertDateStrings } from '@nucleus/common';
import type { GenericEntity } from '../models/generic.model';
import type {
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListQuery,
  RestListResponse,
  RestUpdateResponse,
} from '../models/rest.model';
import type { RestServiceParams } from '../models/rest-service.model';
import { RestApiService } from '../services/rest-api.service';

function convertDateOperator<Response>(dateFields: string[]) {
  return convertDateStrings<Response>(...(dateFields || []).map((f: string) => `data.${f}`));
}

export function createListRestMethod<T extends GenericEntity>({ endpoint }: RestServiceParams) {
  type Query = RestListQuery;
  type Response = RestListResponse<T['list']>;
  const service = inject(RestApiService);

  return (query?: Query) => {
    const url = service.createUrl(endpoint);
    const options = { params: service.createListHttpParams(query) };

    return service.httpClient.get<Response>(url, options);
  };
}

export function createGetRestMethod<T extends GenericEntity>({
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Query = string;
  type Response = RestGetResponse<T['full']>;
  const service = inject(RestApiService);

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.get<Response>(url).pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createAddRestMethod<T extends GenericEntity>({
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Request = T['add'];
  type Response = RestAddResponse<T['full']>;
  const service = inject(RestApiService);

  return (request: Request) => {
    const url = service.createUrl(endpoint);
    return service.httpClient
      .post<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createUpdateRestMethod<T extends GenericEntity>({
  endpoint,
  dateFields,
}: RestServiceParams) {
  type Request = T['update'];
  type Response = RestUpdateResponse<T['full']>;
  const service = inject(RestApiService);

  return (id: string, request: Request) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient
      .patch<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createDeleteRestMethod<_T extends GenericEntity>({ endpoint }: RestServiceParams) {
  type Query = string;
  type Response = RestDeleteResponse;
  const service = inject(RestApiService);

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.delete<Response>(url);
  };
}
