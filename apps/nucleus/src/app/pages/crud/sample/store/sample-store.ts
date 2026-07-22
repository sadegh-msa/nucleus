import { inject } from '@angular/core';
import { createCrudSignalStore } from '@nucleus/core';
import type { SampleListModel, SampleModel, SampleUpdateModel } from '../models/sample.model';
import { sampleConfig } from '../sample.config';
import { SampleRest } from '../services/sample-rest';

export const SampleStore = createCrudSignalStore<SampleListModel, SampleUpdateModel, SampleModel>(
  { title: sampleConfig.info.title },
  () => {
    const sampleRest = inject(SampleRest);

    return {
      list: sampleRest.list,
      get: sampleRest.get,
      add: sampleRest.add,
      update: sampleRest.update,
      delete: sampleRest.delete,
    };
  },
);
