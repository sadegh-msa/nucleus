import { Pipe, type PipeTransform } from '@angular/core';
import { createPagePaths } from '../factory/page-paths-factory';
import type { PageType } from '../types/page.type';

@Pipe({
  name: 'pagePath',
})
export class PagePathPipe implements PipeTransform {
  transform(pageType: PageType, basePath: string[], id?: string): string[] {
    const pagePaths = createPagePaths(basePath);

    return pagePaths[pageType](id ?? '');
  }
}
