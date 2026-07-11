import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideFabricConfig } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../../../../ext/auth/providers/auth-config.provider';
import { provideAuthStore } from '../../../../ext/auth/store/auth.store';
import { SignInComponent } from './sign-in.component';

setupGlobalMocks();

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideRouter([]),
        provideAuthStore(),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideFabricConfig(MOCK_FABRIC_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should have form fields', () => {
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
  });
  it('should have invalid form initially', () => expect(component.form.invalid).toBe(true));
  it('should validate email required', () => {
    component.form.get('email')?.setValue('');
    expect(component.form.get('email')?.hasError('required')).toBe(true);
  });
  it('should validate password minLength', () => {
    component.form.get('password')?.setValue('ab');
    expect(component.form.get('password')?.hasError('minlength')).toBe(true);
  });
  it('should start with isSubmitting false', () => expect(component.isSubmitting()).toBe(false));
});
