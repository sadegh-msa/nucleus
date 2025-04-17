import { ToolType } from '../enums/toolbar.enum';

const { List, Edit, Add, View, Delete } = ToolType;

const list = List.toLowerCase();
const view = View.toLowerCase();
const add = Add.toLowerCase();
const edit = Edit.toLowerCase();
const pDelete = Delete.toLowerCase();

export function createActionPermissions(fullPath: string[]): Partial<Record<ToolType, string>> {
  return {
    [List]: [...fullPath, list].join('.').replace('/.', ''),
    [View]: [...fullPath, view].join('.').replace('/.', ''),
    [Add]: [...fullPath, add].join('.').replace('/.', ''),
    [Edit]: [...fullPath, edit].join('.').replace('/.', ''),
    [Delete]: [...fullPath, pDelete].join('.').replace('/.', '')
  };
}
