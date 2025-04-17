import { TestBed } from '@angular/core/testing';

import { NuDateService } from './date.service';

describe('DateTimeService', () => {
  let service: NuDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
