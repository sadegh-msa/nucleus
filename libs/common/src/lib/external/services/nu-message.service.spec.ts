import { TestBed } from '@angular/core/testing';

import { NuMessageService } from './nu-message.service';

describe('NuMessageService', () => {
  let service: NuMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
