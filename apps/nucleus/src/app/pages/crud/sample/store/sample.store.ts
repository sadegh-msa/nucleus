import { inject } from '@angular/core';
import { createCrudSignalStore } from '@nucleus/core';
import type { Sample, SampleList, SampleUpdate } from '../models/sample.model';
import { sampleConfig } from '../sample.config';
import { SampleRestService } from '../services/sample-rest.service';

export const SampleStore = createCrudSignalStore<SampleList, SampleUpdate, Sample>(
  { title: sampleConfig.info.title },
  () => {
    const sampleRestService = inject(SampleRestService);

    return {
      list: sampleRestService.list,
      get: sampleRestService.get,
      add: sampleRestService.add,
      update: sampleRestService.update,
      delete: sampleRestService.delete,
    };
  },
);
