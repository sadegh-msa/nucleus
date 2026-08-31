import type { PageType } from '../types/page.type';

export type PagePathModel = Record<PageType, (...args: string[]) => string[]>;
