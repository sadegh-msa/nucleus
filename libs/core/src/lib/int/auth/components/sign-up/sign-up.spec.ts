import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../../../../ext/auth/providers/auth-config-provider';
import { provideAuthStore } from '../../../../ext/auth/store/auth-store';
import { SignUp } from './sign-up';

setupGlobalMocks();

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [
        provideRouter([]),
        provideAuthStore(),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should have form fields', () => {
    expect(component.form.email).toBeTruthy();
    expect(component.form.password).toBeTruthy();
    expect(component.form.confirmPassword).toBeTruthy();
  });

  it('should have invalid form initially', () => expect(component.form().invalid()).toBe(true));

  it('should start with isSubmitting false', () => expect(component.isSubmitting()).toBe(false));

  it('should show strength hint as undefined when no password entered', () => {
    fixture.detectChanges();
    const hint = component.passwordHint();
    expect(hint.message).toBe('');
    expect(hint.styleClass).toBeUndefined();
  });

  it('should show moderate hint when password is moderate strength', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('AB1!ab2@');
    component.passwordStrength.set({ moderate: true, strong: false });
    fixture.detectChanges();

    const hint = component.passwordHint();
    expect(hint.message).toBe('Moderate');
    expect(hint.styleClass).toBe('ui text warning');
  });

  it('should show strong hint when password is strong', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('AB1!ab2@CD3#');
    component.passwordStrength.set({ moderate: true, strong: true });
    fixture.detectChanges();

    const hint = component.passwordHint();
    expect(hint.message).toBe('Strong');
    expect(hint.styleClass).toBe('ui text success');
  });

  it('should show match hint when passwords match', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('AB1!ab2@CD3#');
    component.arePasswordsMatching.set(true);
    fixture.detectChanges();

    const hint = component.confirmPasswordHint();
    expect(hint).toEqual({ message: 'Match', styleClass: 'ui text success' });
  });

  it('should show undefined confirm hint when passwords do not match', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('Different@123');
    component.arePasswordsMatching.set(false);
    fixture.detectChanges();

    expect(component.confirmPasswordHint()).toBeUndefined();
  });

  it('should validate password required', () => {
    component.form.email().value.set('user@example.com');
    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate password strength (moderate)', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('weak');
    component.passwordStrength.set({ moderate: false, strong: false });
    fixture.detectChanges();

    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'strength' })]),
    );
  });

  it('should validate confirmPassword matches password', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('Different@1234');
    component.arePasswordsMatching.set(false);
    fixture.detectChanges();

    expect(component.form.confirmPassword().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'match' })]),
    );
  });
});
