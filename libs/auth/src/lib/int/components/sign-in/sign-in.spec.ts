import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../../../ext/providers/auth-config-provider';
import { provideAuthStore } from '../../../ext/store/auth-store';
import { SignIn } from './sign-in';

setupGlobalMocks();

describe('SignIn', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignIn],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAuthStore(),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  const fillValidForm = () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('pass123');
  };

  it('should create', () => expect(component).toBeTruthy());

  it('should have form fields', () => {
    expect(component.form.email).toBeTruthy();
    expect(component.form.password).toBeTruthy();
    expect(component.form.rememberMe).toBeTruthy();
  });

  it('should have invalid form initially', () => expect(component.form().invalid()).toBe(true));

  it('should start with isSubmitting false', () => expect(component.isSubmitting()).toBe(false));

  it('should start with untouched form', () => expect(component.form().touched()).toBe(false));

  describe('validation', () => {
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
      expect(component.form.password().errors()).toEqual(
        expect.arrayContaining([expect.objectContaining({ kind: 'maxLength' })]),
      );
    });

    it('should allow password at the maxLength boundary', () => {
      component.form.email().value.set('user@example.com');
      component.form.password().value.set('a'.repeat(36));
      expect(component.form.password().errors()).toEqual([]);
    });

    it('should have valid form with valid credentials', () => {
      fillValidForm();
      expect(component.form().invalid()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should prevent default and mark as touched without submitting when invalid', () => {
      const event = new Event('submit');
      const preventDefault = vi.spyOn(event, 'preventDefault');

      component.onSubmit(event);

      expect(preventDefault).toHaveBeenCalledOnce();
      expect(component.form().touched()).toBe(true);
      httpMock.expectNone((request) => request.url.includes('signin'));
    });

    it('should submit valid form to the auth store', () => {
      fillValidForm();

      component.onSubmit(new Event('submit'));

      const request = httpMock.expectOne((request) => request.url.includes('signin'));
      expect(request.request.body).toEqual({
        email: 'user@example.com',
        password: 'pass123',
        rememberMe: false,
      });
    });

    it('should not resubmit while a sign-in is in progress', () => {
      fillValidForm();

      component.onSubmit(new Event('submit'));
      httpMock.expectOne((request) => request.url.includes('signin'));
      TestBed.tick();

      component.onSubmit(new Event('submit'));

      httpMock.expectNone((request) => request.url.includes('signin'));
    });

    it('should set isSubmitting true while sign-in is in progress', () => {
      fillValidForm();

      component.onSubmit(new Event('submit'));
      TestBed.tick();

      expect(component.isSubmitting()).toBe(true);
    });

    it('should reset isSubmitting after sign-in succeeds', () => {
      fillValidForm();
      component.onSubmit(new Event('submit'));
      TestBed.tick();
      expect(component.isSubmitting()).toBe(true);

      httpMock
        .expectOne((request) => request.url.includes('signin'))
        .flush({ accessToken: 'token-123', refreshToken: 'refresh-123' });
      TestBed.tick();

      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset isSubmitting after sign-in fails', () => {
      fillValidForm();
      component.onSubmit(new Event('submit'));
      TestBed.tick();
      expect(component.isSubmitting()).toBe(true);

      httpMock
        .expectOne((request) => request.url.includes('signin'))
        .flush(
          {
            code: 401,
            reason: 'Invalid credentials',
            method: 'POST',
            path: '/signin',
            timestamp: '',
          },
          { status: 401, statusText: 'Unauthorized' },
        );
      TestBed.tick();

      expect(component.isSubmitting()).toBe(false);
    });
  });
});
