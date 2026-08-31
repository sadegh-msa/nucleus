import { createPagination, createRowsPerPageOptions } from './pagination-factory';

describe('PaginationFactory', () => {
  describe('createPagination', () => {
    it('should create pagination with default values', () => {
      const pagination = createPagination();

      expect(pagination).toEqual({
        rows: 10,
        page: 0,
        first: 0,
        pages: 0,
        total: 0,
      });
    });

    it('should return an object', () => {
      const pagination = createPagination();
      expect(typeof pagination).toBe('object');
    });
  });

  describe('createRowsPerPageOptions', () => {
    it('should return array of numbers', () => {
      const options = createRowsPerPageOptions();
      expect(Array.isArray(options)).toBe(true);
      options.forEach((opt) => expect(typeof opt).toBe('number'));
    });

    it('should contain default page sizes', () => {
      const options = createRowsPerPageOptions();
      expect(options).toContain(5);
      expect(options).toContain(10);
      expect(options).toContain(25);
      expect(options).toContain(50);
      expect(options).toContain(100);
      expect(options).toContain(200);
    });

    it('should have 6 options', () => {
      const options = createRowsPerPageOptions();
      expect(options).toHaveLength(6);
    });
  });
});
