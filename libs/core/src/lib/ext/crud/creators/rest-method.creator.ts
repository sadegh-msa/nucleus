import { inject } from '@angular/core';
import { convertDateStrings } from '@nucleus/common';
import type { GenericEntityModel } from '../models/generic.model';
import type {
  RestAddResponseModel,
  RestDeleteResponseModel,
  RestGetResponseModel,
  RestListQueryModel,
  RestListResponseModel,
  RestUpdateResponseModel,
} from '../models/rest.model';
import type { RestServiceParamsModel } from '../models/rest-service.model';
import { RestApiService } from '../services/rest-api.service';

function convertDateOperator<Response>(dateFields: string[]) {
  return convertDateStrings<Response>(...(dateFields || []).map((f: string) => `data.${f}`));
}

export function createListRestMethod<T extends GenericEntityModel>({ endpoint }: RestServiceParamsModel) {
  type Query = RestListQueryModel;
  type Response = RestListResponseModel<T['list']>;
  const service = inject(RestApiService);

  return (query?: Query) => {
    const url = service.createUrl(endpoint);
    const options = { params: service.createListHttpParams(query) };

    return service.httpClient.get<Response>(url, options);
  };
}

export function createGetRestMethod<T extends GenericEntityModel>({
  endpoint,
  dateFields,
}: RestServiceParamsModel) {
  type Query = string;
  type Response = RestGetResponseModel<T['full']>;
  const service = inject(RestApiService);

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.get<Response>(url).pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createAddRestMethod<T extends GenericEntityModel>({
  endpoint,
  dateFields,
}: RestServiceParamsModel) {
  type Request = T['add'];
  type Response = RestAddResponseModel<T['full']>;
  const service = inject(RestApiService);

  return (request: Request) => {
    const url = service.createUrl(endpoint);
    return service.httpClient
      .post<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createUpdateRestMethod<T extends GenericEntityModel>({
  endpoint,
  dateFields,
}: RestServiceParamsModel) {
  type Request = T['update'];
  type Response = RestUpdateResponseModel<T['full']>;
  const service = inject(RestApiService);

  return (id: string, request: Request) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient
      .patch<Response>(url, request)
      .pipe(convertDateOperator<Response>(dateFields));
  };
}

export function createDeleteRestMethod<_T extends GenericEntityModel>({ endpoint }: RestServiceParamsModel) {
  type Query = string;
  type Response = RestDeleteResponseModel;
  const service = inject(RestApiService);

  return (id: Query) => {
    const url = service.createUrl(endpoint, id);
    return service.httpClient.delete<Response>(url);
  };
}
