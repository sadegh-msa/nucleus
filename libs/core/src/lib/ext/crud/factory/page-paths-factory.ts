import { PageType } from '../enums/page.enum';
import type { PagePathModel } from '../models/page.model';

const { List, Edit, Add, View } = PageType;
const list = List.toLowerCase();
const view = View.toLowerCase();
const add = Add.toLowerCase();
const edit = Edit.toLowerCase();

export function createPagePaths(fullPath?: string[]): PagePathModel {
  const paths = fullPath?.length ? fullPath : [];

  return {
    [List]: () => [...paths, list],
    [View]: (id: string) => [...paths, view, id],
    [Add]: () => [...paths, add],
    [Edit]: (id: string) => [...paths, edit, id],
  };
}

export const pagePathPattern = Object.freeze({
  [List]: list,
  [View]: `${view}/:id`,
  [Add]: add,
  [Edit]: `${edit}/:id`,
});
