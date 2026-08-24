import { DOCUMENT, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TriggerEventType } from '../../ext/types/trigger.type';
import { UiPopoverBuilder } from './popover-builder';
import { UiPopoverPositioner } from './popover-positioner';
import { UiPopoverRenderer } from './popover-renderer';

describe('UiPopoverBuilder', () => {
  let service: UiPopoverBuilder;
  let positioner: {
    defineCssVars: ReturnType<typeof vi.fn>;
    isInsideEvent: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    positioner = {
      defineCssVars: vi.fn(),
      isInsideEvent: vi.fn().mockReturnValue(false),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: UiPopoverPositioner, useValue: positioner },
        UiPopoverRenderer,
        UiPopoverBuilder,
      ],
    });
    service = TestBed.inject(UiPopoverBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  describe('handleTriggerEvents closure listeners', () => {
    let trigger: HTMLButtonElement;
    let popoverElement: HTMLDivElement;
    let visible: boolean;

    const tick = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const makeLocalInjector = () =>
      ({
        get: (token: unknown) => (token === DOCUMENT ? document : { nativeElement: trigger }),
      }) as never;

    const setup = (
      triggerEvent: TriggerEventType,
      getPopoverElement: () => HTMLElement | undefined,
      modelOverrides: Record<string, unknown> = {},
    ) => {
      visible = false;
      const popover = {
        visible: Object.assign(() => visible, {
          set: (value: boolean) => {
            visible = value;
          },
        }),
        hasClose: false,
        closeDelay: 0,
        ...modelOverrides,
      } as never;

      const cleanup = service.handleTriggerEvents(
        makeLocalInjector(),
        triggerEvent,
        popover,
        getPopoverElement,
      );

      return { cleanup };
    };

    beforeEach(() => {
      trigger = document.createElement('button');
      popoverElement = document.createElement('div');
      document.body.appendChild(trigger);
      document.body.appendChild(popoverElement);
    });

    afterEach(() => {
      trigger.remove();
      popoverElement.remove();
    });

    it('hides the popover on an outside click', async () => {
      const { cleanup } = setup('click', () => popoverElement);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();
      expect(visible).toBe(true);
      expect(positioner.defineCssVars).toHaveBeenCalledWith(expect.anything(), popoverElement);

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(visible).toBe(false);
      expect(positioner.isInsideEvent).toHaveBeenCalled();

      cleanup();
    });

    it('keeps the popover visible when the click lands inside it', async () => {
      positioner.isInsideEvent.mockReturnValue(true);
      const { cleanup } = setup('click', () => popoverElement);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(visible).toBe(true);

      cleanup();
    });

    it('removes closure listeners when the trigger hides the popover', async () => {
      const { cleanup } = setup('click', () => popoverElement);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();
      expect(visible).toBe(true);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();
      expect(visible).toBe(false);

      positioner.isInsideEvent.mockClear();
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(positioner.isInsideEvent).not.toHaveBeenCalled();

      cleanup();
    });

    it('ignores the trigger when no popover element exists', async () => {
      const { cleanup } = setup('click', () => undefined);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();

      expect(visible).toBe(true);
      expect(positioner.defineCssVars).not.toHaveBeenCalled();

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(positioner.isInsideEvent).not.toHaveBeenCalled();

      cleanup();
    });

    it('closes focus-triggered popovers on focus out', async () => {
      const { cleanup } = setup('focus', () => popoverElement);

      trigger.dispatchEvent(new Event('focus'));
      await tick();
      expect(visible).toBe(true);

      document.body.dispatchEvent(new FocusEvent('focusout'));
      expect(visible).toBe(false);

      cleanup();
    });

    it('closes hover-triggered popovers when the pointer moves away', async () => {
      const { cleanup } = setup('hover', () => popoverElement, { closeDelay: undefined });

      trigger.dispatchEvent(new PointerEvent('pointerenter'));
      await tick();
      expect(visible).toBe(true);

      document.body.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
      await tick(20);
      expect(visible).toBe(false);
      expect(positioner.isInsideEvent).toHaveBeenCalled();

      cleanup();
    });

    it('keeps hover-triggered popovers visible while the pointer stays inside', async () => {
      positioner.isInsideEvent.mockReturnValue(true);
      const { cleanup } = setup('hover', () => popoverElement);

      trigger.dispatchEvent(new PointerEvent('pointerenter'));
      await tick();
      expect(visible).toBe(true);

      document.body.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
      await tick(20);
      expect(visible).toBe(true);

      cleanup();
    });

    it('skips the click closure listener when the popover has its own close button', async () => {
      const { cleanup } = setup('click', () => popoverElement, { hasClose: true });

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();
      expect(visible).toBe(true);

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(visible).toBe(true);
      expect(positioner.isInsideEvent).not.toHaveBeenCalled();

      cleanup();
    });

    it('disconnects the visibility observer after cleanup', async () => {
      const { cleanup } = setup('click', () => popoverElement);

      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      await tick();

      vi.useFakeTimers();
      cleanup();
      vi.advanceTimersByTime(1000);
      vi.useRealTimers();
    });
  });
});
