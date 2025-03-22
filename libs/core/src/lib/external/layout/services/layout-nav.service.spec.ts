import { TestBed } from '@angular/core/testing';

import { LayoutNavService } from './layout-nav.service';

describe('LayoutNavService', () => {
  let service: LayoutNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
