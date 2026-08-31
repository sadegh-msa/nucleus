import { Service } from '@angular/core';
import {
  createAddRestMethod,
  createDeleteRestMethod,
  createGetRestMethod,
  createListRestMethod,
  createUpdateRestMethod,
  type RestMethodParamsModel,
} from '@nucleus/crud';
import type { SampleGenericModel } from '../models/sample-generic.model';
import { sampleConfig } from '../sample.config';

@Service()
export class SampleRest {
  readonly #args: RestMethodParamsModel = {
    endpoint: sampleConfig.rest.endpoint,
    dateFields: sampleConfig.field.dates,
  };

  list = createListRestMethod<SampleGenericModel>(this.#args);
  get = createGetRestMethod<SampleGenericModel>(this.#args);
  add = createAddRestMethod<SampleGenericModel>(this.#args);
  update = createUpdateRestMethod<SampleGenericModel>(this.#args);
  delete = createDeleteRestMethod<SampleGenericModel>(this.#args);
}
