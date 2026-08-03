import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../../../../ext/auth/providers/auth-config-provider';
import { provideAuthStore } from '../../../../ext/auth/store/auth-store';
import { SignIn } from './sign-in';

setupGlobalMocks();

describe('SignIn', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignIn],
      providers: [
        provideRouter([]),
        provideAuthStore(),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should have form fields', () => {
    expect(component.form.email).toBeTruthy();
    expect(component.form.password).toBeTruthy();
    expect(component.form.rememberMe).toBeTruthy();
  });

  it('should have invalid form initially', () => expect(component.form().invalid()).toBe(true));

  it('should validate email required', () => {
    component.form.email().value.set('');
    expect(component.form.email().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate email format', () => {
    component.form.email().value.set('invalid-email');
    expect(component.form.email().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'email' })]),
    );
  });

  it('should validate password required', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('');
    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate password maxLength', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('a'.repeat(37));
    const errors = component.form.password().errors();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should start with isSubmitting false', () => expect(component.isSubmitting()).toBe(false));
});
