import { TestBed } from '@angular/core/testing';

import { LayoutProgressbarService } from './layout-progressbar.service';

describe('LayoutBreadcrumbService', () => {
  let service: LayoutProgressbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutProgressbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
