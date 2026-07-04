import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RippleDirective } from './ripple.directive';

@Component({
  template: '<button fabRipple>Click Me</button>',
  imports: [RippleDirective],
})
class TestHostComponent {}

describe('RippleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: HTMLButtonElement;
  let directive: RippleDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
    const btnEl = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
    directive = btnEl.injector.get(RippleDirective);
  });

  it('should have rippler class', () => {
    expect(buttonEl.classList.contains('rippler')).toBe(true);
  });
  it('should be enabled by default', () => expect(directive.isEnabled()).toBe(true));
});
