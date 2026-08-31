export const selectLiterals = ['dropdown', 'dialog'] as const;
export type SelectType = (typeof selectLiterals)[number];
