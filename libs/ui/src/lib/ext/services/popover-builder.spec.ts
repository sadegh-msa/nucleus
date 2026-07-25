import { DOCUMENT, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiPopoverPositioner } from '../../int/services/popover-positioner';
import { UiPopoverRenderer } from '../../int/services/popover-renderer';
import { UiPopoverBuilder } from './popover-builder';

describe('UiPopoverBuilder', () => {
  let service: UiPopoverBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiPopoverPositioner, UiPopoverRenderer, UiPopoverBuilder],
    });
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

  describe('dispatchTriggerEvent', () => {
    it('should dispatch click event as pointerup', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      let dispatched = false;
      trigger.addEventListener('pointerup', () => {
        dispatched = true;
      });

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      service.dispatchTriggerEvent(mockInjector, 'click');
      expect(dispatched).toBe(true);

      document.body.removeChild(trigger);
    });

    it('should dispatch hover event as pointerenter', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      let dispatched = false;
      trigger.addEventListener('pointerenter', () => {
        dispatched = true;
      });

      const mockInjector = {
        get: () => ({ nativeElement: trigger }),
      } as any;

      service.dispatchTriggerEvent(mockInjector, 'hover');
      expect(dispatched).toBe(true);

      document.body.removeChild(trigger);
    });
  });

  describe('handleTriggerEvents', () => {
    it('should return a cleanup function', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);

      const mockInjector = {
        get: (token: any) => {
          if (token === DOCUMENT) return document;
          return { nativeElement: trigger };
        },
      } as any;

      const visibleFn = Object.assign(() => false, { set: () => {} });
      const popover = {
        visible: visibleFn,
        hasClose: false,
        closeDelay: 0,
      } as any;

      const cleanup = service.handleTriggerEvents(mockInjector, 'click', popover, () =>
        document.createElement('div'),
      );

      expect(typeof cleanup).toBe('function');

      cleanup();
      document.body.removeChild(trigger);
    });

    it('should toggle visible on trigger click', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);

      const renderer = {
        setProperty: vi.fn(),
      };

      const mockInjector = {
        get: (token: any) => {
          if (token === DOCUMENT) return document;
          if (token === Renderer2) return renderer;
          return { nativeElement: trigger };
        },
      } as any;

      let visible = false;
      const visibleFn = Object.assign(() => visible, {
        set: (v: boolean) => {
          visible = v;
        },
      });
      const popover = {
        visible: visibleFn,
        hasClose: false,
        closeDelay: 0,
      } as any;

      const cleanup = service.handleTriggerEvents(mockInjector, 'click', popover, () =>
        document.createElement('div'),
      );

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

      await new Promise<void>((r) => setTimeout(r, 0));

      expect(visible).toBe(true);

      cleanup();
      document.body.removeChild(trigger);
    });
  });
});
