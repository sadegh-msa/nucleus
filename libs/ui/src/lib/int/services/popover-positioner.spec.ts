import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
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

  describe('defineCssVars', () => {
    it('should set CSS variables for trigger and popover rects', () => {
      const trigger = document.createElement('button');
      trigger.getBoundingClientRect = () => ({
        left: 10,
        right: 110,
        top: 20,
        bottom: 70,
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        toJSON: () => ({
          left: 10,
          right: 110,
          top: 20,
          bottom: 70,
          x: 10,
          y: 20,
          width: 100,
          height: 50,
        }),
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
        toJSON: () => ({
          left: 200,
          right: 300,
          top: 200,
          bottom: 250,
          x: 200,
          y: 200,
          width: 100,
          height: 50,
        }),
      });

      const mockRenderer = {
        setProperty: vi.fn(),
      };
      const mockElementRef = { nativeElement: trigger };

      const mockInjector = {
        get: (token: any) => {
          if (token === Renderer2) return mockRenderer;
          if (token === ElementRef) return mockElementRef;
          return null;
        },
      } as any;

      service.defineCssVars(mockInjector, popover);

      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-trigger-left:10px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-trigger-right:110px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-trigger-top:20px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-trigger-bottom:70px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-popover-left:200px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-popover-right:300px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-popover-top:200px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-popover-bottom:250px'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('z-index: 200'),
      );
    });

    it('should handle existing style attribute on popover', () => {
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
        toJSON: () => ({
          left: 0,
          right: 50,
          top: 0,
          bottom: 25,
          x: 0,
          y: 0,
          width: 50,
          height: 25,
        }),
      });

      const popover = document.createElement('div');
      popover.setAttribute('style', 'color: red');
      popover.getBoundingClientRect = () => ({
        left: 100,
        right: 200,
        top: 100,
        bottom: 150,
        x: 100,
        y: 100,
        width: 100,
        height: 50,
        toJSON: () => ({
          left: 100,
          right: 200,
          top: 100,
          bottom: 150,
          x: 100,
          y: 100,
          width: 100,
          height: 50,
        }),
      });

      const mockRenderer = {
        setProperty: vi.fn(),
      };
      const mockElementRef = { nativeElement: trigger };

      const mockInjector = {
        get: (token: any) => {
          if (token === Renderer2) return mockRenderer;
          if (token === ElementRef) return mockElementRef;
          return null;
        },
      } as any;

      service.defineCssVars(mockInjector, popover);

      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('color: red'),
      );
      expect(mockRenderer.setProperty).toHaveBeenCalledWith(
        popover,
        'style',
        expect.stringContaining('--ui-trigger-left:0px'),
      );
    });

    it('should append semicolon if style does not end with one', () => {
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
        toJSON: () => ({
          left: 0,
          right: 50,
          top: 0,
          bottom: 25,
          x: 0,
          y: 0,
          width: 50,
          height: 25,
        }),
      });

      const popover = document.createElement('div');
      popover.setAttribute('style', 'color: red');
      popover.getBoundingClientRect = () => ({
        left: 100,
        right: 200,
        top: 100,
        bottom: 150,
        x: 100,
        y: 100,
        width: 100,
        height: 50,
        toJSON: () => ({
          left: 100,
          right: 200,
          top: 100,
          bottom: 150,
          x: 100,
          y: 100,
          width: 100,
          height: 50,
        }),
      });

      const mockRenderer = {
        setProperty: vi.fn(),
      };
      const mockElementRef = { nativeElement: trigger };

      const mockInjector = {
        get: (token: any) => {
          if (token === Renderer2) return mockRenderer;
          if (token === ElementRef) return mockElementRef;
          return null;
        },
      } as any;

      service.defineCssVars(mockInjector, popover);

      const calledStyle = mockRenderer.setProperty.mock.calls[0][2];
      expect(calledStyle).toMatch(/color: red;/);
    });
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
