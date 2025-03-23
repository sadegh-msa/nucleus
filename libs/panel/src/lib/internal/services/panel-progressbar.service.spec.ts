import { TestBed } from '@angular/core/testing';

import { PanelProgressbarService } from './panel-progressbar.service';

describe('PanelBreadcrumbService', () => {
  let service: PanelProgressbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelProgressbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
