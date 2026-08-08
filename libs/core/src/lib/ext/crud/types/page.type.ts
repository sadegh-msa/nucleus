export const pageLiterals = ['list', 'view', 'add', 'edit'] as const;
export type PageType = (typeof pageLiterals)[number];
