import { TestBed } from '@angular/core/testing';
import { UiPopoverPositioner } from './popover-positioner';
import { UiPopoverRenderer } from './popover-renderer';

describe('UiPopoverRenderer', () => {
  let service: UiPopoverRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiPopoverPositioner, UiPopoverRenderer],
    });
    service = TestBed.inject(UiPopoverRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
