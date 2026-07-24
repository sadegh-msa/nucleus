import { createPagePaths, pagePathPattern } from './page-paths-factory';

describe('PagePathsFactory', () => {
  describe('createPagePaths', () => {
    it('should create page paths without fullPath', () => {
      const paths = createPagePaths();

      expect(paths.list()).toEqual(['list']);
      expect(paths.add()).toEqual(['add']);
      expect(paths.view('123')).toEqual(['view', '123']);
      expect(paths.edit('456')).toEqual(['edit', '456']);
    });

    it('should create page paths with fullPath', () => {
      const paths = createPagePaths(['users']);

      expect(paths.list()).toEqual(['users', 'list']);
      expect(paths.add()).toEqual(['users', 'add']);
      expect(paths.view('123')).toEqual(['users', 'view', '123']);
      expect(paths.edit('456')).toEqual(['users', 'edit', '456']);
    });

    it('should create page paths with empty fullPath array', () => {
      const paths = createPagePaths([]);

      expect(paths.list()).toEqual(['list']);
      expect(paths.add()).toEqual(['add']);
    });
  });

  describe('pagePathPattern', () => {
    it('should have correct patterns', () => {
      expect(pagePathPattern.list).toBe('list');
      expect(pagePathPattern.view).toBe('view/:id');
      expect(pagePathPattern.add).toBe('add');
      expect(pagePathPattern.edit).toBe('edit/:id');
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(pagePathPattern)).toBe(true);
    });
  });
});
