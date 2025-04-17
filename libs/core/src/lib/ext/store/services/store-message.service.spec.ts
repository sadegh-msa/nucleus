import { TestBed } from '@angular/core/testing';

import { StoreMessageService } from './store-message.service';

describe('StateMessageService', () => {
  let service: StoreMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
