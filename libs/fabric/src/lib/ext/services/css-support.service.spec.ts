import { TestBed } from '@angular/core/testing';

import { CssSupportService } from './css-support.service';

describe('CssSupportService', () => {
  let service: CssSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
