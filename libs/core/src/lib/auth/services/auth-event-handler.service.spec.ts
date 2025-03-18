import { TestBed } from '@angular/core/testing';

import { AuthEventHandlerService } from './auth-event-handler.service';

describe('AuthEventHandlerService', () => {
  let service: AuthEventHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthEventHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
