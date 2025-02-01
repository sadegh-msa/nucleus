import { TestBed } from '@angular/core/testing';

import { NuPanelService } from './panel.service';

describe('PanelService', () => {
  let service: NuPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
