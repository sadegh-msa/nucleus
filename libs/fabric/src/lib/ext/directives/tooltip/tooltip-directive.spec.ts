import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip-directive';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

@Component({
  template: '<span fabTooltip="Tooltip content">Hover me</span>',
  imports: [TooltipDirective],
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: TooltipDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const spanEl = fixture.debugElement.query((el) => el.nativeElement.tagName === 'SPAN');
    directive = spanEl.injector.get(TooltipDirective);
  });

  it('should create', () => expect(directive).toBeTruthy());
  it('should have content set', () => expect(directive.content()).toBe('Tooltip content'));
  it('should have default placement as auto', () => expect(directive.placement()).toBe('auto'));
  it('should have default disabled as false', () => expect(directive.disabled()).toBe(false));
  it('should have default visible as false', () => expect(directive.visible()).toBe(false));
  it('should compute popover config', () => {
    const popover = directive.popover();
    expect(popover.content).toBe('Tooltip content');
    expect(popover.hasClose).toBe(false);
    expect(popover.styleClass).toContain('tooltip');
  });
});
