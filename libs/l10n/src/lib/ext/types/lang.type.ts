export const langLiterals = ['en-US', 'fa'] as const;
export type LangType = (typeof langLiterals)[number];

export const langDirLiterals = ['ltr', 'rtl'] as const;
export type LangDirType = (typeof langDirLiterals)[number];
