import { Pipe, type PipeTransform } from '@angular/core';
import type { PageType } from '../enums/page.enum';
import { createPagePaths } from '../factory/page-paths-factory';

@Pipe({
  name: 'pagePath',
})
export class PagePathPipe implements PipeTransform {
  transform(pageType: PageType, basePath: string[], id?: string): string[] {
    const pagePaths = createPagePaths(basePath);

    return pagePaths[pageType](id || '');
  }
}
