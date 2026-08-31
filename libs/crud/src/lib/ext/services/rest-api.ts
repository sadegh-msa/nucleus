import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { injectNuCommonConfig, isNotEmpty, isNotNil } from '@nucleus/common';
import type { RestListQueryModel } from '../models/rest.model';

@Service()
export class RestApi {
  readonly httpClient = inject(HttpClient);
  readonly commonConfig = injectNuCommonConfig();

  createUrl(...paths: string[]) {
    return [this.commonConfig.api.rest.url, ...paths].filter((p) => !!p).join('/');
  }

  createListHttpParams({ page, rows, order, filter, fields }: RestListQueryModel = {}) {
    const fromObject = {
      ...(isNotNil(page) && Number.isInteger(page) && { page }),
      ...(isNotNil(rows) && Number.isInteger(rows) && { rows }),
      ...(isNotNil(order) && isNotEmpty(order) && { order: JSON.stringify(order) }),
      ...(isNotNil(filter) && isNotEmpty(filter) && { filter: JSON.stringify(filter) }),
      ...(isNotNil(fields) && isNotEmpty(fields) && { fields: fields.join(',') }),
    };

    return new HttpParams({ fromObject });
  }
}
