import { Component, computed, input, model } from '@angular/core';
import { UiPopover, UiRipple } from '@nucleus/ui';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { createRowsPerPageOptions } from '../../factory/pagination-factory';
import type { PaginationModel } from '../../models/pagination.model';
import type { ToolbarModel } from '../../models/toolbar.model';
import { GenericToolbar } from '../generic-toolbar/generic-toolbar';

@Component({
  selector: 'nu-generic-list-toolbar',
  templateUrl: './generic-list-toolbar.html',
  imports: [DividerModule, GenericToolbar, PaginatorModule, UiRipple, UiPopover],
})
export class GenericListToolbar {
  readonly paginatorLabel = computed(() => this.createPaginatorLabel());

  showPaginator = input(true);
  rowsPerPageOptions = input(createRowsPerPageOptions());
  toolbar = input.required<ToolbarModel>();
  selectedRecords = input(0);
  pagination = model.required<PaginationModel>();

  paginate(paginator: PaginatorState) {
    this.pagination.update((current) => ({
      ...current,
      first: paginator.first || 0,
      page: paginator.page || 0,
      rows: paginator.rows || current.rows,
    }));
  }

  createPaginatorLabel() {
    const { total, page, first, pages, rows } = this.pagination();
    const selected = this.selectedRecords();
    const last = first + rows > total ? total : first + rows;

    let label = selected ? `${selected} Selected | ` : '';
    label += `Rows ${first + 1} - ${last} of ${total}`;
    label += ` | Page ${page + 1} of ${pages}`;

    return label;
  }
}
