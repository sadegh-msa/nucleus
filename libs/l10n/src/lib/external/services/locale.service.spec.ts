import { TestBed } from '@angular/core/testing';

import { NuLocaleService } from './locale.service';

describe('NuLocaleService', () => {
  let service: NuLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
