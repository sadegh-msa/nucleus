import { TestBed } from '@angular/core/testing';
import { UiPopoverPositioner } from './popover-positioner';

describe('UiPopoverPositioner', () => {
  let service: UiPopoverPositioner;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UiPopoverPositioner] });
    service = TestBed.inject(UiPopoverPositioner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isInsideEvent', () => {
    it('should return true when target is the trigger element', () => {
      const trigger = document.createElement('button');
      const popover = document.createElement('div');
      document.body.appendChild(trigger);

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      const event = {
        target: trigger,
        clientX: 0,
        clientY: 0,
      } as any;

      const result = service.isInsideEvent(mockInjector, popover, event);
      expect(result).toBe(true);

      document.body.removeChild(trigger);
    });

    it('should return true when target is the popover element', () => {
      const trigger = document.createElement('button');
      trigger.getBoundingClientRect = () => ({
        left: 0,
        right: 100,
        top: 0,
        bottom: 50,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        toJSON: () => ({}),
      });
      const popover = document.createElement('div');
      popover.getBoundingClientRect = () => ({
        left: 200,
        right: 300,
        top: 200,
        bottom: 250,
        x: 200,
        y: 200,
        width: 100,
        height: 50,
        toJSON: () => ({}),
      });

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      const event = {
        target: popover,
        clientX: 250,
        clientY: 225,
      } as any;

      const result = service.isInsideEvent(mockInjector, popover, event);
      expect(result).toBe(true);
    });

    it('should return true when coordinates are inside trigger rect', () => {
      const trigger = document.createElement('button');
      trigger.getBoundingClientRect = () => ({
        left: 10,
        right: 100,
        top: 10,
        bottom: 50,
        x: 10,
        y: 10,
        width: 90,
        height: 40,
        toJSON: () => ({}),
      });
      const popover = document.createElement('div');

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      const event = {
        target: document.createElement('div'),
        clientX: 50,
        clientY: 30,
      } as any;

      const result = service.isInsideEvent(mockInjector, popover, event);
      expect(result).toBe(true);
    });

    it('should return true when coordinates are inside popover rect', () => {
      const trigger = document.createElement('button');
      trigger.getBoundingClientRect = () => ({
        left: 0,
        right: 50,
        top: 0,
        bottom: 25,
        x: 0,
        y: 0,
        width: 50,
        height: 25,
        toJSON: () => ({}),
      });
      const popover = document.createElement('div');
      popover.getBoundingClientRect = () => ({
        left: 200,
        right: 300,
        top: 200,
        bottom: 250,
        x: 200,
        y: 200,
        width: 100,
        height: 50,
        toJSON: () => ({}),
      });

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      const event = {
        target: document.createElement('div'),
        clientX: 250,
        clientY: 225,
      } as any;

      const result = service.isInsideEvent(mockInjector, popover, event);
      expect(result).toBe(true);
    });

    it('should return false when coordinates are outside both rects', () => {
      const trigger = document.createElement('button');
      trigger.getBoundingClientRect = () => ({
        left: 0,
        right: 50,
        top: 0,
        bottom: 25,
        x: 0,
        y: 0,
        width: 50,
        height: 25,
        toJSON: () => ({}),
      });
      const popover = document.createElement('div');
      popover.getBoundingClientRect = () => ({
        left: 200,
        right: 300,
        top: 200,
        bottom: 250,
        x: 200,
        y: 200,
        width: 100,
        height: 50,
        toJSON: () => ({}),
      });

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      const event = {
        target: document.createElement('div'),
        clientX: 100,
        clientY: 100,
      } as any;

      const result = service.isInsideEvent(mockInjector, popover, event);
      expect(result).toBe(false);
    });
  });
});
