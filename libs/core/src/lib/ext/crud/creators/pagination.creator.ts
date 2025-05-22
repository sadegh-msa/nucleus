import { Pagination } from '../models/pagination.model';

export class PaginationCreator {
  static createPagination(): Pagination {
    return {
      rows: 10,
      page: 0,
      first: 0,
      pages: 0,
      total: 0,
    };
  }

  static createRowsPerPageOptions() {
    return [5, 10, 25, 50, 100, 200];
  }
}
