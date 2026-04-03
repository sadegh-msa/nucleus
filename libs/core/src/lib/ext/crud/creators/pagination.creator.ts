import type { Pagination } from '../models/pagination.model';

export function createPagination(): Pagination {
  return {
    rows: 10,
    page: 0,
    first: 0,
    pages: 0,
    total: 0,
  };
}

export function createRowsPerPageOptions() {
  return [5, 10, 25, 50, 100, 200];
}
