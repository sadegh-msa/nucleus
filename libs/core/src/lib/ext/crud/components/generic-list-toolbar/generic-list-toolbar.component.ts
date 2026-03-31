import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { PaginationCreator } from '../../creators/pagination.creator';
import type { Pagination } from '../../models/pagination.model';
import type { NuToolbar } from '../../models/toolbar.model';
import { GenericToolbarComponent } from '../generic-toolbar/generic-toolbar.component';

@Component({
  selector: 'nu-generic-list-toolbar',
  templateUrl: './generic-list-toolbar.component.html',
  imports: [DividerModule, GenericToolbarComponent, OverlayPanelModule, PaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericListToolbarComponent {
  readonly paginatorLabel = computed(() => this.createPaginatorLabel());

  showPaginator = input(true);
  rowsPerPageOptions = input(PaginationCreator.createRowsPerPageOptions());
  toolbar = input.required<NuToolbar>();
  selectedRecords = input(0);
  pagination = model.required<Pagination>();

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
