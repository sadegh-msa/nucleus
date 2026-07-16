import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverDirective } from './popover-directive';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

@Component({
  template: '<div uiPopover="Popover content">Trigger</div>',
  imports: [PopoverDirective],
})
class TestHostComponent {}

describe('PopoverDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: PopoverDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(
      (el) => el.nativeElement.tagName === 'DIV' && el.nativeElement.hasAttribute('uipopover'),
    );
    directive = divEl.injector.get(PopoverDirective);
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
    expect(p.attachTo).toBe('body');
  });
});
