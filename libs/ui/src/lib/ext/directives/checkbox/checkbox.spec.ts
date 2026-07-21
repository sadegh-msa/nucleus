import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCheckbox } from './checkbox';

@Component({
  template: '<input type="checkbox" uiCheckbox />',
  imports: [UiCheckbox],
})
class TestHostComponent {}

describe('UiCheckbox', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
  });

  it('should create an instance', () => {
    expect(inputEl).toBeTruthy();
    expect(inputEl.classList.contains('ui')).toBe(true);
    expect(inputEl.classList.contains('checkbox')).toBe(true);
  });

  it('should set checkmark SVG path style on init', () => {
    const style = inputEl.getAttribute('style');
    expect(style).toContain('--checkmark-svg-path');
  });

  it('should update checkmark SVG path on click', () => {
    const styleBefore = inputEl.getAttribute('style');
    inputEl.click();
    const styleAfter = inputEl.getAttribute('style');
    expect(styleAfter).toContain('--checkmark-svg-path');
    expect(styleAfter).not.toBe(styleBefore);
  });
});
