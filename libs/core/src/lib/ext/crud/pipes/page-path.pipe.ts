import { Pipe, PipeTransform } from '@angular/core';
import { createPagePaths } from '../creators/page-paths.creator';
import { PageType } from '../enums/page.enum';

@Pipe({
  name: 'pagePath',
})
export class PagePathPipe implements PipeTransform {
  transform(pageType: PageType, basePath: string[], id?: string): string[] {
    const pagePaths = createPagePaths(basePath);

    return pagePaths[pageType](id || '');
  }
}
