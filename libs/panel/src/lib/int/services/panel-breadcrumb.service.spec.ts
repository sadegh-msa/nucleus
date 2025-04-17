import { TestBed } from '@angular/core/testing';

import { PanelBreadcrumbService } from './panel-breadcrumb.service';

describe('PanelBreadcrumbService', () => {
  let service: PanelBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
