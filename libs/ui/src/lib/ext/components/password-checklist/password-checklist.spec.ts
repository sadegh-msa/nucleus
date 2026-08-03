import { signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { FieldState } from '@angular/forms/signals';
import type { PasswordStrengthModel } from '@nucleus/common';
import { UiPasswordChecklist } from './password-checklist';

describe('UiPasswordChecklist', () => {
  let component: UiPasswordChecklist;
  let fixture: ComponentFixture<UiPasswordChecklist>;

  const mockFieldState = {
    value: signal('test'),
    controlValue: signal('test'),
  };

  const mockPasswordStrength: PasswordStrengthModel = {
    hasUpperCase: true,
    hasLowerCase: true,
    hasDigit: true,
    hasSpecial: true,
    hasConsecutiveRepeated: false,
    moderate: true,
    strong: false,
    condition: { upperCase: 2, lowerCase: 2, digit: 2, special: 2 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPasswordChecklist],
    }).compileComponents();

    fixture = TestBed.createComponent(UiPasswordChecklist);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'fieldState',
      mockFieldState as unknown as FieldState<string, string>,
    );
    fixture.componentRef.setInput('passwordStrength', mockPasswordStrength);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
