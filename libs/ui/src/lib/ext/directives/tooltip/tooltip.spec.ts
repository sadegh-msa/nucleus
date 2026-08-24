import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { setupGlobalMocks } from '@test-mocks';
import { afterEach, vi } from 'vitest';
import { UiPopoverBuilder } from '../../services/popover-builder';
import { UiTooltip } from './tooltip';

setupGlobalMocks();

@Component({
  template: '<span uiTooltip="Tooltip content">Hover me</span>',
  imports: [UiTooltip],
})
class TestHostComponent {}

describe('UiTooltip', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: UiTooltip;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const spanEl = fixture.debugElement.query((el) => el.nativeElement.tagName === 'SPAN');
    directive = spanEl.injector.get(UiTooltip);
  });

  it('should create', () => expect(directive).toBeTruthy());
  it('should have content set', () => expect(directive.content()).toBe('Tooltip content'));
  it('should have default placement as block-start-inline-center', () =>
    expect(directive.placement()).toBe('block-start-inline-center'));
  it('should have default disabled as false', () => expect(directive.disabled()).toBe(false));
  it('should have default visible as false', () => expect(directive.visible()).toBe(false));
  it('should compute popover config', () => {
    const popover = directive.popover();
    expect(popover.content).toBe('Tooltip content');
    expect(popover.hasClose).toBe(false);
    expect(popover.styleClass).toContain('tooltip');
  });

  afterEach(() => fixture?.destroy());
});

@Component({
  template: '<span [uiTooltip]="content()" [uiTooltipDisabled]="disabled()">Hover me</span>',
  imports: [UiTooltip],
})
class DynamicHostComponent {
  content = signal('Dynamic tooltip');
  disabled = signal(false);
}

@Component({
  template: '<span uiTooltip="">Hover me</span>',
  imports: [UiTooltip],
})
class EmptyHostComponent {}

describe('UiTooltip popover lifecycle', () => {
  let fixture: ComponentFixture<DynamicHostComponent>;
  let host: DynamicHostComponent;
  let directive: UiTooltip;
  let builderMock: {
    render: ReturnType<typeof vi.fn>;
    handleTriggerEvents: ReturnType<typeof vi.fn>;
    showPopover: ReturnType<typeof vi.fn>;
    hidePopover: ReturnType<typeof vi.fn>;
  };
  let popoverElement: HTMLDivElement;
  let cleanUpElementObservers: ReturnType<typeof vi.fn>;
  let cleanupTriggerListener: ReturnType<typeof vi.fn>;
  let getPopoverElement: (() => HTMLElement | undefined) | undefined;

  const querySpan = (target: ComponentFixture<unknown>) =>
    target.debugElement.query((el) => el.nativeElement.tagName === 'SPAN');

  beforeEach(async () => {
    popoverElement = document.createElement('div');
    cleanUpElementObservers = vi.fn();
    cleanupTriggerListener = vi.fn();
    getPopoverElement = undefined;
    builderMock = {
      render: vi.fn(() => ({ popoverElement, cleanUpElementObservers })),
      handleTriggerEvents: vi.fn(
        (
          _injector: unknown,
          _triggerEvent: unknown,
          _popover: unknown,
          getEl: () => HTMLElement | undefined,
        ) => {
          getPopoverElement = getEl;

          return cleanupTriggerListener;
        },
      ),
      showPopover: vi.fn(),
      hidePopover: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DynamicHostComponent, EmptyHostComponent],
      providers: [{ provide: UiPopoverBuilder, useValue: builderMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = querySpan(fixture).injector.get(UiTooltip);
  });

  afterEach(() => fixture?.destroy());

  it('exposes the trigger element', () => {
    expect(directive.triggerElement.tagName).toBe('SPAN');
  });

  it('renders and shows the tooltip when it becomes visible', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    expect(builderMock.render).toHaveBeenCalledTimes(1);
    expect(builderMock.render.mock.calls[0][1]).toBe('hover');
    expect(directive.tooltipElement).toBe(popoverElement);
    expect(builderMock.showPopover).toHaveBeenCalledWith(popoverElement);
    expect(cleanUpElementObservers).not.toHaveBeenCalled();
  });

  it('hides the tooltip when visibility turns off', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    directive.visible.set(false);
    fixture.detectChanges();

    expect(builderMock.hidePopover).toHaveBeenCalledWith(popoverElement);
    expect(builderMock.showPopover).toHaveBeenCalledTimes(1);
  });

  it('does not wire events or render while disabled from the start', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(DynamicHostComponent);
    host = fixture.componentInstance;
    host.disabled.set(true);
    builderMock.handleTriggerEvents.mockClear();

    fixture.detectChanges();

    expect(builderMock.handleTriggerEvents).not.toHaveBeenCalled();
    expect(builderMock.render).not.toHaveBeenCalled();

    const disabledDirective = querySpan(fixture).injector.get(UiTooltip);
    disabledDirective.visible.set(true);
    fixture.detectChanges();

    expect(builderMock.render).not.toHaveBeenCalled();
    expect(builderMock.showPopover).not.toHaveBeenCalled();
  });

  it('cleans observers up when disabled after rendering', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    host.disabled.set(true);
    fixture.detectChanges();
    fixture.detectChanges();

    expect(builderMock.hidePopover).toHaveBeenCalledWith(popoverElement);
    expect(cleanUpElementObservers).toHaveBeenCalled();
  });

  it('does not wire events when the content is empty', () => {
    builderMock.handleTriggerEvents.mockClear();

    const emptyFixture = TestBed.createComponent(EmptyHostComponent);
    emptyFixture.detectChanges();

    expect(builderMock.handleTriggerEvents).not.toHaveBeenCalled();
    emptyFixture.destroy();
  });

  it('renders lazily through the popover element getter', () => {
    expect(directive.tooltipElement).toBeUndefined();

    expect(getPopoverElement?.()).toBe(popoverElement);
    expect(builderMock.render).toHaveBeenCalledTimes(1);

    expect(getPopoverElement?.()).toBe(popoverElement);
    expect(builderMock.render).toHaveBeenCalledTimes(1);
  });

  it('re-renders and detaches the old tooltip when the content changes', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    const container = directive.triggerElement.parentElement as HTMLElement;
    container.appendChild(popoverElement);

    host.content.set('Updated tooltip');
    fixture.detectChanges();
    fixture.detectChanges();

    expect(builderMock.render).toHaveBeenCalledTimes(2);
    expect(builderMock.handleTriggerEvents).toHaveBeenCalledTimes(2);
    expect(container.contains(popoverElement)).toBe(false);
    expect(cleanUpElementObservers).toHaveBeenCalledTimes(1);
  });

  it('cleans everything up on destroy', () => {
    directive.visible.set(true);
    fixture.detectChanges();
    document.body.appendChild(popoverElement);

    fixture.destroy();
    fixture = undefined as never;

    expect(cleanupTriggerListener).toHaveBeenCalled();
    expect(cleanUpElementObservers).toHaveBeenCalled();
    expect(document.body.contains(popoverElement)).toBe(false);
  });
});
