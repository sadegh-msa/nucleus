export const toolLiterals = [
  'add',
  'back',
  'cancel',
  'close',
  'delete',
  'deleteAll',
  'deleteSelected',
  'edit',
  'empty',
  'export',
  'import',
  'list',
  'print',
  'refresh',
  'save',
  'view',
] as const;
export type ToolType = (typeof toolLiterals)[number];

export const toolElementLiterals = ['button', 'link'] as const;
export type ToolElementType = (typeof toolElementLiterals)[number];
