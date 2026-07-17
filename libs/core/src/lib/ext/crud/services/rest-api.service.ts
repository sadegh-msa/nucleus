import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import type { RestListQueryModel } from '../models/rest.model';

@Service()
export class RestApiService {
  readonly httpClient = inject(HttpClient);
  readonly commonConfig = injectNuCommonConfig();

  createUrl(...paths: string[]) {
    return [this.commonConfig.api.rest.url, ...paths].filter((p) => !!p).join('/');
  }

  createListHttpParams(query: RestListQueryModel = {}) {
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
