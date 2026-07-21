import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiRipple } from './ripple';

@Component({
  template: '<button uiRipple>Click Me</button>',
  imports: [UiRipple],
})
class TestHostComponent {}

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
});
