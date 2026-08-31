import { inject } from '@angular/core';
import { createCrudSignalStore } from '@nucleus/crud';
import type { SampleListModel, SampleModel, SampleUpdateModel } from '../models/sample.model';
import { sampleConfig } from '../sample.config';
import { SampleRest } from '../services/sample-rest';

export const SampleStore = createCrudSignalStore<SampleListModel, SampleUpdateModel, SampleModel>(
  { title: sampleConfig.info.title },
  () => inject(SampleRest),
);
