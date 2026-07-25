import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { setupGlobalMocks } from '@test-mocks';
import { afterEach } from 'vitest';
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
  it('should have default placement', () => expect(directive.placement()).toBe('auto'));
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

  afterEach(() => fixture?.destroy());
});
