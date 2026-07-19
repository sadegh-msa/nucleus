import { Component, effect, inject, input, type OnInit, untracked } from '@angular/core';
import { DataType } from '@nucleus/common';
import {
  createTableToolbar,
  GenericListBuilder,
  GenericListComponent,
  GenericListToolbarComponent,
  type NuTableModel,
} from '@nucleus/core/crud';
import type { SampleListModel, SampleModel } from '../../models/sample.model';
import type { GenericSampleListModel, SampleGenericModel } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample.store';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  imports: [GenericListComponent, GenericListToolbarComponent],
  providers: [GenericListBuilder],
})
export class SampleListComponent implements OnInit, GenericSampleListModel {
  readonly #genericListBuilder = inject(GenericListBuilder<SampleGenericModel>);

  isEmbedded = input(false);

  readonly config = sampleConfig;
  readonly store = inject(SampleStore);
  readonly table: NuTableModel = {
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

  isDataLoading!: GenericSampleListModel['isDataLoading'];
  data!: GenericSampleListModel['data'];
  pagination!: GenericSampleListModel['pagination'];
  selectedRecords!: GenericSampleListModel['selectedRecords'];
  toolbar!: GenericSampleListModel['toolbar'];
  changeSelection!: GenericSampleListModel['changeSelection'];
  filteredData: SampleListModel = [];

  constructor() {
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
