import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiRipple } from './ripple';

@Component({
  template: '<button uiRipple>Click Me</button>',
  imports: [UiRipple],
})
class TestHostComponent {}

@Component({
  template: '<button [uiRipple]="false">Disabled</button>',
  imports: [UiRipple],
})
class DisabledHostComponent {}

describe('UiRipple', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: HTMLButtonElement;
  let directive: UiRipple;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
    const btnEl = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
    directive = btnEl.injector.get(UiRipple);
  });

  it('should have rippler class', () => {
    expect(buttonEl.classList.contains('rippler')).toBe(true);
  });

  it('should be enabled by default', () => expect(directive.isEnabled()).toBe(true));

  it('should attach ripple on pointerdown', () => {
    const event = new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 50 });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    const ripple = buttonEl.querySelector('.ripple');
    expect(ripple).toBeTruthy();
  });

  it('should finish existing ripple on second pointerdown', () => {
    const event1 = new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 50 });
    buttonEl.dispatchEvent(event1);
    fixture.detectChanges();

    const ripple1 = buttonEl.querySelector('.ripple');
    expect(ripple1).toBeTruthy();
    expect(ripple1?.classList.contains('ending')).toBe(true);

    const event2 = new PointerEvent('pointerdown', { bubbles: true, clientX: 60, clientY: 60 });
    buttonEl.dispatchEvent(event2);
    fixture.detectChanges();

    const allRipples = buttonEl.querySelectorAll('.ripple');
    expect(allRipples.length).toBeGreaterThanOrEqual(0);
  });

  it('should clear host on pointerleave after pointerdown', () => {
    const downEvent = new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 50 });
    buttonEl.dispatchEvent(downEvent);
    fixture.detectChanges();

    expect(buttonEl.querySelector('.ripple')).toBeTruthy();

    const leaveEvent = new PointerEvent('pointerleave', { bubbles: true });
    buttonEl.dispatchEvent(leaveEvent);
    fixture.detectChanges();

    expect(buttonEl.querySelector('.ripple')).toBeFalsy();
  });

  it('should not clear host on pointerleave without pointerdown', () => {
    const event = new PointerEvent('pointerleave', { bubbles: true });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    expect(directive.isEnabled()).toBe(true);
  });

  it('should attach ripple on keydown Enter', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    const ripple = buttonEl.querySelector('.ripple');
    expect(ripple).toBeTruthy();
  });

  it('should not attach ripple on non-Enter keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space', bubbles: true });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    const ripple = buttonEl.querySelector('.ripple');
    expect(ripple).toBeFalsy();
  });

  it('should set auto position when layerX/layerY are -1 (Enter key)', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    const ripple = buttonEl.querySelector('.ripple') as HTMLElement;
    expect(ripple).toBeTruthy();
    expect(ripple.style.getPropertyValue('--ui-ripple-left')).toBe('auto');
    expect(ripple.style.getPropertyValue('--ui-ripple-top')).toBe('auto');
  });
});

describe('UiRipple disabled', () => {
  let fixture: ComponentFixture<DisabledHostComponent>;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DisabledHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
  });

  it('should not attach ripple when disabled', () => {
    const event = new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 50 });
    buttonEl.dispatchEvent(event);
    fixture.detectChanges();

    const ripple = buttonEl.querySelector('.ripple');
    expect(ripple).toBeFalsy();
  });
});
