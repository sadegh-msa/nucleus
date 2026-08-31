import { Component, inject, input, type OnInit } from '@angular/core';
import {
  createTableToolbar,
  GenericList,
  GenericListBuilder,
  GenericListToolbar,
  type TableModel,
} from '@nucleus/crud';
import { AbstractGenericSampleList } from '../../abstracts/abstract-generic-sample-list';
import type { SampleModel } from '../../models/sample.model';
import type { SampleGenericModel } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample-store';

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
