import {
  DOCUMENT,
  ElementRef,
  type Injector,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import type { UiPopoverModel } from '../../ext/models';
import { UiPopoverPositioner } from './popover-positioner';
import { UiPopoverRenderer } from './popover-renderer';

const { visualObserverInstances } = vi.hoisted(() => ({
  visualObserverInstances: [] as {
    callback: () => void;
    observed: unknown[];
    disconnectCalls: number;
  }[],
}));

vi.mock('../../ext/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../ext/helpers')>();

  class MockVisualObserver {
    observed: unknown[] = [];
    disconnectCalls = 0;

    constructor(public callback: () => void) {
      visualObserverInstances.push(this);
    }

    observe(target: unknown) {
      this.observed.push(target);
    }

    disconnect() {
      this.disconnectCalls++;
    }
  }

  return { ...actual, VisualObserver: MockVisualObserver };
});

describe('UiPopoverRenderer', () => {
  let service: UiPopoverRenderer;
  let positioner: { defineCssVars: ReturnType<typeof vi.fn> };
  let trigger: HTMLButtonElement;
  let triggerParent: HTMLDivElement;

  const fakeRenderer = {
    createElement: (name: string) => document.createElement(name),
    setAttribute: (el: Element, name: string, value: string) => el.setAttribute(name, value),
    appendChild: (parent: Node, child: Node) => {
      parent.appendChild(child);

      return child;
    },
    parentNode: (node: Node) => node.parentNode,
    insertBefore: (parent: Node, child: Node, ref: Node) => {
      parent.insertBefore(child, ref);

      return child;
    },
    setProperty: (el: Record<string, unknown>, name: string, value: unknown) => {
      el[name] = value;
    },
  };

  const makeInjector = (viewContainer?: { createEmbeddedView: ReturnType<typeof vi.fn> }) =>
    ({
      get: (token: unknown) => {
        if (token === DOCUMENT) return document;
        if (token === Renderer2) return fakeRenderer;
        if (token === ViewContainerRef) return viewContainer;
        if (token === ElementRef) return { nativeElement: trigger };

        return undefined;
      },
    }) as unknown as Injector;

  const makePopoverModel = (overrides: Partial<UiPopoverModel> = {}) =>
    ({
      content: 'Hello popover',
      templateData: undefined,
      styleClass: '',
      placement: 'block-start-edge-center',
      hasBubble: false,
      hasArrow: false,
      hasClose: false,
      closeDelay: 0,
      attachTo: 'body',
      visible: signal(false),
      ...overrides,
    }) as UiPopoverModel;

  beforeEach(() => {
    visualObserverInstances.length = 0;
    positioner = { defineCssVars: vi.fn() };
    TestBed.configureTestingModule({
      providers: [UiPopoverRenderer, { provide: UiPopoverPositioner, useValue: positioner }],
    });
    service = TestBed.inject(UiPopoverRenderer);

    trigger = document.createElement('button');
    triggerParent = document.createElement('div');
    triggerParent.appendChild(trigger);
    document.body.appendChild(triggerParent);
  });

  afterEach(() => {
    triggerParent.remove();
    document.getElementById('ui-popover-container')?.remove();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('renders string content into a body-attached container', () => {
    const { popoverElement } = service.render(makeInjector(), 'click', makePopoverModel());

    expect(popoverElement.querySelector('p').getHTML()).toBe('Hello popover');
    expect(popoverElement.classList.contains('popover')).toBe(true);
    expect(popoverElement.classList.contains('numb')).toBe(true);
    expect(popoverElement.classList.contains('transparent')).toBe(true);
    expect(popoverElement.parentElement?.id).toBe('ui-popover-container');
    expect(document.getElementById('ui-popover-container')).toBeTruthy();
  });

  it('renders template content through the view container', () => {
    const templateRef = Object.create(TemplateRef.prototype) as TemplateRef<unknown>;
    const node = document.createElement('span');
    const createEmbeddedView = vi.fn().mockReturnValue({
      rootNodes: [node],
      detectChanges: vi.fn(),
    });

    const { popoverElement } = service.render(
      makeInjector({ createEmbeddedView } as never),
      'click',
      makePopoverModel({ content: templateRef, templateData: { id: 1 } }),
    );

    expect(createEmbeddedView).toHaveBeenCalledWith(
      templateRef,
      {
        data: { id: 1 },
        control: { close: expect.any(Function) },
      },
      {
        injector: expect.anything(),
      },
    );
    expect(createEmbeddedView.mock.results[0].value.detectChanges).toHaveBeenCalled();
    expect(popoverElement.contains(node)).toBe(true);
  });

  it('closes the popover through the template context close control', () => {
    const visible = signal(true);
    const templateRef = Object.create(TemplateRef.prototype) as TemplateRef<unknown>;
    const createEmbeddedView = vi.fn().mockReturnValue({
      rootNodes: [document.createElement('span')],
      detectChanges: vi.fn(),
    });

    service.render(
      makeInjector({ createEmbeddedView } as never),
      'click',
      makePopoverModel({ content: templateRef, visible }),
    );

    const context = createEmbeddedView.mock.calls[0][1] as {
      control: { close: () => void };
    };

    context.control.close();
    expect(visible()).toBe(false);
  });

  it('adds bubble arrow and close button for click popovers with close support', () => {
    const visible = signal(true);

    const { popoverElement } = service.render(
      makeInjector(),
      'click',
      makePopoverModel({ hasBubble: true, hasArrow: true, hasClose: true, visible }),
    );

    expect(popoverElement.classList.contains('bubble')).toBe(true);
    expect(popoverElement.querySelector('i.bubble-arrow')).toBeTruthy();

    const closeButton = popoverElement.querySelector('button');
    expect(closeButton.classList.contains('bubble-close')).toBe(true);
    expect(closeButton.getHTML()).toContain('svg');

    (closeButton as unknown as { onclick: (event: Event) => void }).onclick(new Event('click'));
    expect(visible()).toBe(false);
  });

  it('skips the close button and arrow for hover popovers', () => {
    const { popoverElement } = service.render(
      makeInjector(),
      'hover',
      makePopoverModel({ hasBubble: true, hasClose: true }),
    );

    expect(popoverElement.classList.contains('bubble')).toBe(true);
    expect(popoverElement.querySelector('i.bubble-arrow')).toBeNull();
    expect(popoverElement.querySelector('button')).toBeNull();
  });

  it('inserts the popover before the trigger when attached to the parent', () => {
    const { popoverElement } = service.render(
      makeInjector(),
      'click',
      makePopoverModel({ attachTo: 'parent' }),
    );

    expect(popoverElement.parentElement).toBe(triggerParent);
    expect(trigger.previousSibling).toBe(popoverElement);
  });

  it('appends the popover to a custom element when attachTo is an element', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    const { popoverElement } = service.render(
      makeInjector(),
      'click',
      makePopoverModel({ attachTo: host }),
    );

    expect(popoverElement.parentElement).toBe(host);
    host.remove();
  });

  it('reuses an existing body container instead of creating a second one', () => {
    const existing = document.createElement('div');
    existing.setAttribute('id', 'ui-popover-container');
    document.body.appendChild(existing);

    const { popoverElement } = service.render(makeInjector(), 'click', makePopoverModel());

    expect(popoverElement.parentElement).toBe(existing);
    expect(document.querySelectorAll('[id="ui-popover-container"]').length).toBe(1);
  });

  it('attaches the popover nowhere when attachTo matches no known target', () => {
    const { popoverElement } = service.render(
      makeInjector(),
      'click',
      makePopoverModel({ attachTo: undefined as never }),
    );

    expect(popoverElement.parentElement).toBeNull();
  });

  it('skips the trigger visual observer inside another popover', () => {
    const host = document.createElement('div');
    Object.defineProperty(host, 'classList', {
      value: { contains: () => true },
      configurable: true,
    });
    document.body.appendChild(host);

    const { popoverElement, cleanUpElementObservers } = service.render(
      makeInjector(),
      'click',
      makePopoverModel({ attachTo: host }),
    );

    expect(popoverElement.parentElement).toBe(host);
    expect(visualObserverInstances.length).toBe(1);

    cleanUpElementObservers();
    expect(visualObserverInstances[0].disconnectCalls).toBe(1);
    host.remove();
  });

  it('repositions only while the popover is visible on trigger changes', () => {
    const injector = makeInjector();
    const { popoverElement } = service.render(injector, 'click', makePopoverModel());

    const triggerObserver = visualObserverInstances[0];
    expect(triggerObserver.observed).toContain(trigger);

    const computedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ opacity: '1' } as unknown as CSSStyleDeclaration);
    triggerObserver.callback();
    expect(positioner.defineCssVars).toHaveBeenCalledWith(injector, popoverElement);

    positioner.defineCssVars.mockClear();
    computedStyleSpy.mockReturnValue({ opacity: '0' } as unknown as CSSStyleDeclaration);
    triggerObserver.callback();
    expect(positioner.defineCssVars).not.toHaveBeenCalled();
  });

  it('repositions on popover changes and disconnects observers on cleanup', () => {
    const injector = makeInjector();
    const { popoverElement, cleanUpElementObservers } = service.render(
      injector,
      'click',
      makePopoverModel(),
    );

    const popoverObserver = visualObserverInstances[1];
    expect(popoverObserver.observed).toContain(popoverElement);

    popoverObserver.callback();
    expect(positioner.defineCssVars).toHaveBeenCalledWith(injector, popoverElement);

    cleanUpElementObservers();
    expect(visualObserverInstances[0].disconnectCalls).toBe(1);
    expect(visualObserverInstances[1].disconnectCalls).toBe(1);
  });
});
