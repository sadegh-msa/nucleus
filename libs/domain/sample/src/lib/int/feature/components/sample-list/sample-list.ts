import { Component, inject, input, type OnInit } from '@angular/core';
import {
  createTableToolbar,
  GenericList,
  GenericListBuilder,
  GenericListToolbar,
  type TableModel,
} from '@nucleus/crud';
import { sampleConfig } from '../../../../ext/sample.config';
import type { SampleModel } from '../../../data/models/sample.model';
import type { SampleGenericModel } from '../../../data/models/sample-generic.model';
import { SampleStore } from '../../../data/store/sample-store';
import { AbstractGenericSampleList } from '../../abstracts/abstract-generic-sample-list';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.html',
  imports: [GenericList, GenericListToolbar],
  providers: [GenericListBuilder],
})
export class SampleList extends AbstractGenericSampleList implements OnInit {
  readonly #genericListBuilder = inject(GenericListBuilder<SampleGenericModel>);

  isEmbedded = input(false);

  readonly config = sampleConfig;
  readonly store = inject(SampleStore);
  readonly table: TableModel = {
    columns: [
      { field: 'index', label: '#', tooltip: 'Index', type: 'index' },
      {
        field: 'active',
        label: 'A',
        tooltip: 'is Active',
        type: 'boolean',
        format: 'icon',
        ngClass: 'boolean',
      },
      { field: 'code', label: 'Code' },
      { field: 'title', label: 'Title' },
      {
        field: 'date',
        label: 'Date',
        type: 'datetime',
        format: 'longDate',
      },
    ],
    ...createTableToolbar<SampleGenericModel>(this.config),
  };

  constructor() {
    super();

    this.#genericListBuilder.init(this);
  }

  ngOnInit() {
    this.#genericListBuilder.run();
  }

  activate(row: SampleModel) {
    console.log(row);
  }
}
