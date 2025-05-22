import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { RestListQuery } from '../models/rest.model';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  readonly httpClient = inject(HttpClient);
  readonly commonConfig = inject(NU_COMMON_CONFIG);

  createUrl(...paths: string[]) {
    return [this.commonConfig.api.rest.url, ...paths].filter((p) => !!p).join('/');
  }

  createListHttpParams(query: RestListQuery = {}) {
    const fromObject = {
      ...(Number.isInteger(query.page) && { page: query.page }),
      ...(Number.isInteger(query.rows) && { rows: query.rows }),
      ...(Object.keys(query.order || {}).length && { order: JSON.stringify(query.order) }),
      ...(Object.keys(query.filter || {}).length && { filter: JSON.stringify(query.filter) }),
      ...(query.fields?.length && { fields: query.fields.join(',') }),
    };

    return new HttpParams({ fromObject });
  }
}
