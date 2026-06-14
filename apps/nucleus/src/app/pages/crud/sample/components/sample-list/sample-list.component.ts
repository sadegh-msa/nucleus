import { Component, DestroyRef, inject, input, type OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DataType } from '@nucleus/common';
import {
  createTableToolbar,
  GenericListComponent,
  GenericListService,
  GenericListToolbarComponent,
  type NuTable
} from '@nucleus/core';
import type { GenericSampleList, SampleGeneric } from '../../models/sample-generic.model';
import type { Sample, SampleList } from '../../models/sample.model';
import { sampleConfig } from '../../sample.config';
import { sampleActions, sampleSelectors } from '../../store';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  imports: [GenericListComponent, GenericListToolbarComponent],
  providers: [GenericListService],
})
export class SampleListComponent implements OnInit, GenericSampleList {
  readonly #destroyRef = inject(DestroyRef);
  readonly #genericListService = inject(GenericListService<SampleGeneric>);

  isEmbedded = input(false);

  readonly config = sampleConfig;
  readonly store = {
    actions: sampleActions,
    selectors: sampleSelectors,
  };
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

    toObservable(this.data)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.updateFilteredData());
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
