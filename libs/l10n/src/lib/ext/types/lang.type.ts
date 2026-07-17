export const nuLangs = ['en-US', 'fa'] as const;
export type NuLang = (typeof nuLangs)[number];

export const nuLangDirs = ['ltr', 'rtl'] as const;
export type NuLangDir = (typeof nuLangDirs)[number];
