import { TestBed } from '@angular/core/testing';
import { UiPopoverBuilder } from './popover-builder';

describe('UiPopoverBuilder', () => {
  let service: UiPopoverBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UiPopoverBuilder] });
    service = TestBed.inject(UiPopoverBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('EVENT_MAP', () => {
    it('should have click mapped to pointerup', () => {
      expect(service.EVENT_MAP.click).toBe('pointerup');
    });
    it('should have hover mapped to pointerenter', () => {
      expect(service.EVENT_MAP.hover).toBe('pointerenter');
    });
  });

  describe('showPopover', () => {
    it('should remove numb and transparent classes', () => {
      const element = document.createElement('div');
      element.className = 'numb transparent';
      service.showPopover(element);
      expect(element.classList.contains('numb')).toBe(false);
      expect(element.classList.contains('transparent')).toBe(false);
    });
  });

  describe('hidePopover', () => {
    it('should add numb and transparent classes', () => {
      const element = document.createElement('div');
      service.hidePopover(element);
      expect(element.classList.contains('numb')).toBe(true);
      expect(element.classList.contains('transparent')).toBe(true);
    });
  });
});
