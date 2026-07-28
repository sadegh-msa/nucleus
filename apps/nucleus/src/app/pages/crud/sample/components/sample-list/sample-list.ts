import { Component, effect, inject, input, type OnInit, untracked } from '@angular/core';
import { DataType } from '@nucleus/common';
import {
  createTableToolbar,
  GenericList,
  GenericListBuilder,
  GenericListToolbar,
  type TableModel,
} from '@nucleus/core';
import { AbstractGenericSampleList } from '../../abstracts/abstract-generic-sample-list';
import type { SampleListModel, SampleModel } from '../../models/sample.model';
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
      { field: 'index', label: '#', tooltip: 'Index', type: DataType.Index },
      {
        field: 'active',
        label: 'A',
        tooltip: 'is Active',
        type: DataType.Boolean,
        format: 'icon',
        ngClass: 'boolean',
      },
      { field: 'code', label: 'Code' },
      { field: 'title', label: 'Title' },
      {
        field: 'date',
        label: 'Date',
        type: DataType.Datetime,
        format: 'longDate',
      },
      { field: 'divisionId', label: 'Division' },
    ],
    ...createTableToolbar<SampleGenericModel>(this.config),
  };

  filteredData: SampleListModel = [];

  constructor() {
    super();

    this.#genericListBuilder.init(this);

    effect(() => {
      this.data();

      untracked(() => {
        this.updateFilteredData();
      });
    });
  }

  ngOnInit() {
    this.#genericListBuilder.run();
  }

  updateFilteredData() {
    const { first, rows } = this.pagination();
    this.filteredData = this.data().slice(first, first + rows);

    this.pagination.update((pagination) => {
      return {
        ...pagination,
        total: this.data().length,
        pages: Math.ceil(pagination.total / pagination.rows),
      };
    });
  }

  activate(row: SampleModel) {
    console.log(row);
  }
}
