import type { PageType } from '../enums/page.enum';

export type PagePathModel = Record<PageType, (...args: string[]) => string[]>;
