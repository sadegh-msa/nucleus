import {
  Component,
  computed,
  effect,
  input,
  model,
  type OnDestroy,
  untracked,
} from '@angular/core';
import type { SetTimeoutType } from '@nucleus/common';
import { UiPopover, UiRipple, UiSvgIcon, UiTooltip } from '@nucleus/ui';
import { createRowsPerPageOptions } from '../../factory/pagination-factory';
import type { PaginationModel } from '../../models/pagination.model';
import type { ToolbarModel } from '../../models/toolbar.model';
import { GenericToolbar } from '../generic-toolbar/generic-toolbar';

@Component({
  selector: 'nu-generic-list-toolbar',
  templateUrl: './generic-list-toolbar.html',
  imports: [GenericToolbar, UiRipple, UiPopover, UiTooltip, UiSvgIcon],
})
export class GenericListToolbar implements OnDestroy {
  toolbar = input.required<ToolbarModel>();
  pagination = model.required<PaginationModel>();
  rowsPerPageOptions = input(createRowsPerPageOptions());
  showPaginator = input(true);
  selectedRows = input(0);

  readonly paginatorLabel = computed(() => this.createPaginatorLabel());
  readonly isBackButtonDisabled = computed(() => this.pagination().page === 0);
  readonly isNextButtonDisabled = computed(
    () => this.pagination().page + 1 === this.pagination().pages,
  );

  #pageSetTimeout: SetTimeoutType = 0;

  constructor() {
    effect(() => {
      this.pagination();
      untracked(() => this.#resetPageSetTimeout());
    });
  }

  ngOnDestroy() {
    this.#resetPageSetTimeout();
  }

  #resetPageSetTimeout() {
    clearTimeout(this.#pageSetTimeout);
  }

  createPaginatorLabel() {
    const { total, page, first, pages, rows } = this.pagination();
    const selected = this.selectedRows();
    const last = first + rows > total ? total : first + rows;

    return {
      selected: selected ? `${selected} ${$localize`selected`}` : '',
      rows: `${first + 1} - ${last} / ${total}`,
      page: `${page + 1} / ${pages}`,
    };
  }

  goPage(page: number) {
    this.#resetPageSetTimeout();

    this.#pageSetTimeout = setTimeout(() => {
      this.pagination.update((current) => ({ ...current, page }));
    }, 500);
  }

  goFirstPage() {
    this.goPage(0);
  }

  goPreviousPage() {
    const { page } = this.pagination();
    const previousPage = page - 1;

    if (previousPage > -1) {
      this.goPage(previousPage);
    }
  }

  goNextPage() {
    const { page, pages } = this.pagination();
    const nextPage = page + 1;

    if (nextPage < pages) {
      this.goPage(nextPage);
    }
  }

  goLastPage() {
    const { pages } = this.pagination();
    this.goPage(pages - 1);
  }

  setRowsPerPage(rows: number) {
    this.pagination.update((current) => ({
      ...current,
      rows,
    }));
  }
}
