import { Service } from '@angular/core';
import {
  createAddRestMethod,
  createDeleteRestMethod,
  createGetRestMethod,
  createListRestMethod,
  createUpdateRestMethod,
  type RestServiceParams,
} from '@nucleus/core';
import type { SampleGeneric } from '../models/sample-generic.model';
import { sampleConfig } from '../sample.config';

@Service()
export class SampleRestService {
  readonly #args: RestServiceParams = {
    endpoint: sampleConfig.rest.endpoint,
    dateFields: sampleConfig.field.dates,
  };

  list = createListRestMethod<SampleGeneric>(this.#args);
  get = createGetRestMethod<SampleGeneric>(this.#args);
  add = createAddRestMethod<SampleGeneric>(this.#args);
  update = createUpdateRestMethod<SampleGeneric>(this.#args);
  delete = createDeleteRestMethod<SampleGeneric>(this.#args);
}
