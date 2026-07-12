import { Component, effect, inject, input, type OnInit, untracked } from '@angular/core';
import { DataType } from '@nucleus/common';
import {
  createTableToolbar,
  GenericListComponent,
  GenericListService,
  GenericListToolbarComponent,
  type NuTable,
} from '@nucleus/core';
import type { Sample, SampleList } from '../../models/sample.model';
import type { GenericSampleList, SampleGeneric } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample.store';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  imports: [GenericListComponent, GenericListToolbarComponent],
  providers: [GenericListService],
})
export class SampleListComponent implements OnInit, GenericSampleList {
  readonly #genericListService = inject(GenericListService<SampleGeneric>);

  isEmbedded = input(false);

  readonly config = sampleConfig;
  readonly store = inject(SampleStore);
  readonly table: NuTable = {
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
    ...createTableToolbar<SampleGeneric>(this.config),
  };

  isDataLoading!: GenericSampleList['isDataLoading'];
  data!: GenericSampleList['data'];
  pagination!: GenericSampleList['pagination'];
  selectedRecords!: GenericSampleList['selectedRecords'];
  toolbar!: GenericSampleList['toolbar'];
  changeSelection!: GenericSampleList['changeSelection'];
  filteredData: SampleList = [];

  constructor() {
    this.#genericListService.init(this);

    effect(() => {
      this.data();

      untracked(() => {
        this.updateFilteredData();
      });
    });
  }

  ngOnInit() {
    this.#genericListService.run();
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

  activate(row: Sample) {
    console.log(row);
  }
}
