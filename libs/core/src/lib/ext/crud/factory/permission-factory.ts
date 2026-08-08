import type { ToolType } from '../types/toolbar.type';

const list = 'list';
const view = 'view';
const add = 'add';
const edit = 'edit';
const tDelete = 'delete';

export function createActionPermissions(fullPath: string[]): Partial<Record<ToolType, string>> {
  return {
    [list]: [...fullPath, list].join('.').replace('/.', ''),
    [view]: [...fullPath, view].join('.').replace('/.', ''),
    [add]: [...fullPath, add].join('.').replace('/.', ''),
    [edit]: [...fullPath, edit].join('.').replace('/.', ''),
    [tDelete]: [...fullPath, tDelete].join('.').replace('/.', ''),
  };
}
