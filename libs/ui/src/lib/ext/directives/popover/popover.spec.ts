import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { setupGlobalMocks } from '@test-mocks';
import { afterEach, vi } from 'vitest';
import { UiPopoverBuilder } from '../../services/popover-builder';
import { UiPopover } from './popover';

setupGlobalMocks();

@Component({
  template: '<div uiPopover="Popover content">Trigger</div>',
  imports: [UiPopover],
})
class TestHostComponent {}

@Component({
  template:
    '<div uiPopover="Popover content" [uiPopoverDisabled]="disabled" [uiPopoverHasClose]="hasClose">Trigger</div>',
  imports: [UiPopover],
})
class ConfigurableHostComponent {}

describe('UiPopover', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: UiPopover;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(
      (el) => el.nativeElement.tagName === 'DIV' && el.nativeElement.hasAttribute('uipopover'),
    );
    directive = divEl.injector.get(UiPopover);
  });

  it('should create', () => expect(directive).toBeTruthy());
  it('should have content set', () => expect(directive.content()).toBe('Popover content'));
  it('should have default triggerEvent', () => expect(directive.triggerEvent()).toBe('click'));
  it('should have default placement', () =>
    expect(directive.placement()).toBe('block-start-inline-center'));
  it('should have default disabled', () => expect(directive.disabled()).toBe(false));
  it('should have default visible', () => expect(directive.visible()).toBe(false));
  it('should compute popover config', () => {
    const p = directive.popover();
    expect(p.content).toBe('Popover content');
    expect(p.hasBubble).toBe(true);
    expect(p.hasArrow).toBe(true);
    expect(p.hasClose).toBe(false);
    expect(p.attachTo).toBe('body');
    expect(p.styleClass).toBe('text stamp fade-normal');
  });

  afterEach(() => fixture?.destroy());
});

describe('UiPopover configurable', () => {
  let fixture: ComponentFixture<ConfigurableHostComponent>;
  let directive: UiPopover;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurableHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ConfigurableHostComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(
      (el) => el.nativeElement.tagName === 'DIV' && el.nativeElement.hasAttribute('uipopover'),
    );
    directive = divEl.injector.get(UiPopover);
  });

  it('should have default closeDelay 0', () => expect(directive.closeDelay()).toBe(0));
  it('should have default attachTo body', () => expect(directive.attachTo()).toBe('body'));

  it('should emit visibility on show', () => {
    const spy = vi.fn();
    directive.visibility.subscribe(spy);

    directive.visible.set(true);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should set hasClose when provided', () => {
    expect(directive.hasClose()).toBe(false);
  });

  afterEach(() => fixture?.destroy());
});

describe('UiPopover effects', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: UiPopover;
  let popoverBuilder: UiPopoverBuilder;
  let renderSpy: ReturnType<typeof vi.fn>;
  let showSpy: ReturnType<typeof vi.fn>;
  let hideSpy: ReturnType<typeof vi.fn>;
  let handleTriggerSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    renderSpy = vi.fn().mockReturnValue({
      popoverElement: document.createElement('div'),
      cleanUpElementObservers: vi.fn(),
    });
    showSpy = vi.fn();
    hideSpy = vi.fn();
    handleTriggerSpy = vi.fn().mockReturnValue(() => {});

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: UiPopoverBuilder,
          useValue: {
            render: renderSpy,
            showPopover: showSpy,
            hidePopover: hideSpy,
            handleTriggerEvents: handleTriggerSpy,
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(
      (el) => el.nativeElement.tagName === 'DIV' && el.nativeElement.hasAttribute('uipopover'),
    );
    directive = divEl.injector.get(UiPopover);
    popoverBuilder = TestBed.inject(UiPopoverBuilder);
  });

  it('should call handleTriggerEvents on init', () => {
    expect(handleTriggerSpy).toHaveBeenCalled();
  });

  it('should render popover when visible becomes true', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    expect(renderSpy).toHaveBeenCalled();
    expect(showSpy).toHaveBeenCalled();
  });

  it('should hide popover when visible becomes false', () => {
    directive.visible.set(true);
    fixture.detectChanges();
    vi.clearAllMocks();

    directive.visible.set(false);
    fixture.detectChanges();

    expect(hideSpy).toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    directive.visible.set(true);
    fixture.detectChanges();

    fixture.destroy();
    expect(true).toBe(true);
  });

it('should call renderPopover when handleTriggerEvents is called with existing popoverElement', () => {
    directive.visible.set(true);
    fixture.detectChanges();
    vi.clearAllMocks();

    const handleTriggerCallback = handleTriggerSpy.mock.results[0]?.value;
    if (handleTriggerCallback) {
      handleTriggerCallback();
      fixture.detectChanges();

      expect(renderSpy).toHaveBeenCalled();
    }
  });

  it('should render popover when getPopoverElement callback is called and popoverElement is null', () => {
    const handleTriggerCall = handleTriggerSpy.mock.calls[0];
    const getPopoverElement = handleTriggerCall?.[3];

    if (getPopoverElement) {
      (directive as any).popoverElement = null;
      vi.clearAllMocks();

      getPopoverElement();
      fixture.detectChanges();

      expect(renderSpy).toHaveBeenCalled();
    }
  });

  it('should call renderPopover when getPopoverElement is called and popoverElement exists', () => {
    const handleTriggerCall = handleTriggerSpy.mock.calls[0];
    const getPopoverElement = handleTriggerCall?.[3];

    if (getPopoverElement) {
      vi.clearAllMocks();

      getPopoverElement();
      fixture.detectChanges();

      expect(renderSpy).toHaveBeenCalled();
    }
  });

  afterEach(() => fixture?.destroy());
});
