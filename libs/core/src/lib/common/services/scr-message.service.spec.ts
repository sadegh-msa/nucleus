import { TestBed } from '@angular/core/testing';

import { ScrMessageService } from './scr-message.service';

describe('ScrMessageService', () => {
  let service: ScrMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
