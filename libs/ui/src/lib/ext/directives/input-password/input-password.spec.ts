import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form, required } from '@angular/forms/signals';
import { type PasswordStrengthModel, PasswordValidator } from '@nucleus/common';
import { UiInputPassword } from './input-password';

@Component({
  template: `
    <input
      uiInputPassword
      [formField]="hostForm.password"
      [passwordToConfirm]="hostForm.confirmPassword().value()"
      (strength)="onStrength($event)"
      (confirm)="onConfirm($event)"
    />
  `,
  imports: [UiInputPassword, FormField],
})
class TestHostComponent {
  readonly model = signal({ password: '', confirmPassword: '' });
  readonly form = form(this.model, (f) => {
    required(f.password);
    required(f.confirmPassword);
  });

  readonly strengthResult = signal<PasswordStrengthModel | null>(null);
  readonly confirmResult = signal<boolean | null>(null);

  hostForm = this.form;

  onStrength(result: PasswordStrengthModel) {
    this.strengthResult.set(result);
  }

  onConfirm(result: boolean) {
    this.confirmResult.set(result);
  }
}

describe('UiInputPassword', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [PasswordValidator],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture?.destroy?.();
  });

  it('should create', () => {
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
    expect(inputEl).toBeTruthy();
    expect(inputEl.classList.contains('ui')).toBe(true);
    expect(inputEl.classList.contains('input')).toBe(true);
    expect(inputEl.classList.contains('password')).toBe(true);
  });

  it('should set type attribute to password on init', () => {
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
    expect(inputEl.getAttribute('type')).toBe('password');
  });

  it('should emit strength when password changes', () => {
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');

    component.model().password = 'AB1!ab2@CD3#';
    component.hostForm.password().value.set('AB1!ab2@CD3#');

    fixture.detectChanges();

    const result = component.strengthResult();
    expect(result).toBeTruthy();
    expect(result?.moderate).toBe(true);
    expect(result?.strong).toBe(true);
  });

  it('should emit confirm result when password matches', () => {
    fixture.detectChanges();

    component.model().confirmPassword = 'Password@123';
    component.hostForm.confirmPassword().value.set('Password@123');
    component.hostForm.password().value.set('Password@123');

    fixture.detectChanges();

    expect(component.confirmResult()).toBe(true);
  });

  it('should emit confirm false when password does not match', () => {
    fixture.detectChanges();

    component.hostForm.password().value.set('Password@1');
    component.hostForm.confirmPassword().value.set('password@2');

    fixture.detectChanges();

    expect(component.confirmResult()).toBe(false);
  });
});
