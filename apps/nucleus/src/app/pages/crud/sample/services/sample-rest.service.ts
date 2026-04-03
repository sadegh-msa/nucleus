import { inject, Injectable } from '@angular/core';
import { RestApiService, RestServiceCreator, RestServiceParams } from '@nucleus/core';
import { SampleGeneric } from '../models/sample-generic.model';
import { sampleConfig } from '../sample.config';

@Injectable({
  providedIn: 'root',
})
export class SampleRestService {
  readonly #args: RestServiceParams = {
    service: inject(RestApiService),
    endpoint: sampleConfig.rest.endpoint,
    dateFields: sampleConfig.field.dates,
  };

  list = RestServiceCreator.createList<SampleGeneric>(this.#args);
  get = RestServiceCreator.createGet<SampleGeneric>(this.#args);
  add = RestServiceCreator.createAdd<SampleGeneric>(this.#args);
  update = RestServiceCreator.createUpdate<SampleGeneric>(this.#args);
  delete = RestServiceCreator.createDelete<SampleGeneric>(this.#args);
}
