import {
  GenericEntity,
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListQuery,
  RestListResponse,
  RestServiceParams,
  RestUpdateResponse
} from '..';
import { convertDateStrings } from '../../common';

function convertDateOperator<Response>(dateFields: string[]) {
  return convertDateStrings<Response>(...(dateFields || [])
    .map((f: string) => 'data.' + f));
}

export class RestServiceCreator {
  static createList<T extends GenericEntity>({ service, endpoint }: RestServiceParams) {
    type Query = RestListQuery
    type Response = RestListResponse<T['list']>

    return function(query?: Query) {
      const url = service.createUrl(endpoint);
      const options = { params: service.createListHttpParams(query) };

      return service.httpClient.get<Response>(url, options);
    };
  }

  static createGet<T extends GenericEntity>({ service, endpoint, dateFields }: RestServiceParams) {
    type Query = string
    type Response = RestGetResponse<T['full']>

    return function(id: Query) {
      const url = service.createUrl(endpoint, id);
      return service.httpClient.get<Response>(url)
        .pipe(convertDateOperator<Response>(dateFields));
    };
  }

  static createAdd<T extends GenericEntity>({ service, endpoint, dateFields }: RestServiceParams) {
    type Request = T['add']
    type Response = RestAddResponse<T['full']>

    return function(request: Request) {
      const url = service.createUrl(endpoint);
      return service.httpClient.post<Response>(url, request)
        .pipe(convertDateOperator<Response>(dateFields));
    };
  }

  static createUpdate<T extends GenericEntity>({ service, endpoint, dateFields }: RestServiceParams) {
    type Request = T['update']
    type Response = RestUpdateResponse<T['full']>

    return function(id: string, request: Request) {
      const url = service.createUrl(endpoint, id);
      return service.httpClient.patch<Response>(url, request)
        .pipe(convertDateOperator<Response>(dateFields));
    };
  }

  static createDelete<T extends GenericEntity>({ service, endpoint }: RestServiceParams) {
    type Query = string
    type Response = RestDeleteResponse

    return function(id: Query) {
      const url = service.createUrl(endpoint, id);
      return service.httpClient.delete<Response>(url);
    };
  }
}
