import { TestBed } from '@angular/core/testing';

import { UiScreenService } from './ui-screen.service';

describe('UiScreenService', () => {
  let service: UiScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
