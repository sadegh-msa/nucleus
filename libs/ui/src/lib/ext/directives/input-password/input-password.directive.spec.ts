import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputPasswordDirective } from './input-password.directive';

@Component({
  template: '<input uiInputPassword ngModel />',
  imports: [InputPasswordDirective, FormsModule],
})
class TestHostComponent {}

describe('InputPasswordDirective', () => {
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

  it('should create', () => {
    expect(inputEl).toBeTruthy();
    expect(inputEl.classList.contains('ui')).toBe(true);
    expect(inputEl.classList.contains('input')).toBe(true);
    expect(inputEl.classList.contains('password')).toBe(true);
  });

  it('should set type attribute to password', () => {
    expect(inputEl.getAttribute('type')).toBe('password');
  });
});
