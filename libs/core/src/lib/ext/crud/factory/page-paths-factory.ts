import type { PagePathModel } from '../models/page.model';

const list = 'list';
const view = 'view';
const add = 'add';
const edit = 'edit';

export function createPagePaths(fullPath?: string[]): PagePathModel {
  const paths = fullPath?.length ? fullPath : [];

  return {
    [list]: () => [...paths, list],
    [view]: (id: string) => [...paths, view, id],
    [add]: () => [...paths, add],
    [edit]: (id: string) => [...paths, edit, id],
  };
}

export const pagePathPattern = Object.freeze({
  [list]: list,
  [view]: `${view}/:id`,
  [add]: add,
  [edit]: `${edit}/:id`,
});
