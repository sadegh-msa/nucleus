import { TestBed } from '@angular/core/testing';

import { LayoutBreadcrumbService } from './layout-breadcrumb.service';

describe('LayoutBreadcrumbService', () => {
  let service: LayoutBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
