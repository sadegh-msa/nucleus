import { inject } from '@angular/core';
import { createCrudSignalStore } from '@nucleus/core';
import type { SampleModel, SampleListModel, SampleUpdateModel } from '../models/sample.model';
import { sampleConfig } from '../sample.config';
import { SampleRestService } from '../services/sample-rest.service';

export const SampleStore = createCrudSignalStore<SampleListModel, SampleUpdateModel, SampleModel>(
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
