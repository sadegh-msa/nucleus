import { PagePathPipe } from './page-path-pipe';

describe('PagePathPipe', () => {
  let pipe: PagePathPipe;

  beforeEach(() => {
    pipe = new PagePathPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform list page type', () => {
    const result = pipe.transform('list' as any, ['users']);
    expect(result).toEqual(['users', 'list']);
  });

  it('should transform add page type', () => {
    const result = pipe.transform('add' as any, ['users']);
    expect(result).toEqual(['users', 'add']);
  });

  it('should transform view page type with id', () => {
    const result = pipe.transform('view' as any, ['users'], '123');
    expect(result).toEqual(['users', 'view', '123']);
  });

  it('should transform edit page type with id', () => {
    const result = pipe.transform('edit' as any, ['users'], '456');
    expect(result).toEqual(['users', 'edit', '456']);
  });

  it('should transform view page type without id', () => {
    const result = pipe.transform('view' as any, ['users']);
    expect(result).toEqual(['users', 'view', '']);
  });

  it('should transform with empty basePath', () => {
    const result = pipe.transform('list' as any, []);
    expect(result).toEqual(['list']);
  });
});
