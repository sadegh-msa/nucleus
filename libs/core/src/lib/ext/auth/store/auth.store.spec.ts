import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OperationStatus, provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../providers/auth-config.provider';
import { AuthRestService } from '../services/auth-rest.service';
import { injectAuthStore, provideAuthStore } from './auth.store';

setupGlobalMocks();

describe('AuthStore', () => {
  let authStore: ReturnType<typeof injectAuthStore>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAuthStore(),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
        AuthRestService,
      ],
    });

    authStore = TestBed.runInInjectionContext(() => injectAuthStore());
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initial state', () => {
    it('should have Initial status for all states', () => {
      expect(authStore.checkStatus()).toBe(OperationStatus.Initial);
      expect(authStore.signInStatus()).toBe(OperationStatus.Initial);
      expect(authStore.signUpStatus()).toBe(OperationStatus.Initial);
      expect(authStore.signOutStatus()).toBe(OperationStatus.Initial);
    });

    it('should not be check success initially', () => {
      expect(authStore.isCheckSuccess()).toBe(false);
    });

    it('should return empty initial states', () => {
      const signInState = authStore.signInState();
      expect(signInState.status).toBe(OperationStatus.Initial);
      expect(signInState.response.token.accessToken).toBeNull();

      const signUpState = authStore.signUpState();
      expect(signUpState.status).toBe(OperationStatus.Initial);
      expect(signUpState.response.token.accessToken).toBeNull();

      const signOutState = authStore.signOutState();
      expect(signOutState.status).toBe(OperationStatus.Initial);

      const checkState = authStore.checkState();
      expect(checkState.status).toBe(OperationStatus.Initial);
    });
  });

  describe('checkSuccess / checkFailure', () => {
    it('should set check status to Success', () => {
      authStore.checkSuccess();
      expect(authStore.checkStatus()).toBe(OperationStatus.Success);
      expect(authStore.isCheckSuccess()).toBe(true);
    });

    it('should set check status to Failure', () => {
      authStore.checkFailure();
      expect(authStore.checkStatus()).toBe(OperationStatus.Failure);
      expect(authStore.isCheckSuccess()).toBe(false);
    });
  });

  describe('signIn', () => {
    it('should set status to InProgress then Success on success', () => {
      const request = { email: 'test@test.com', password: 'pass123' };

      authStore.signIn(request);
      expect(authStore.signInStatus()).toBe(OperationStatus.InProgress);

      const req = httpMock.expectOne((r) => r.url.includes('signin'));
      req.flush({ accessToken: 'token-123', refreshToken: 'refresh-123' });

      expect(authStore.signInStatus()).toBe(OperationStatus.Success);
      expect(authStore.signInResponse().token.accessToken).toBe('token-123');
    });

    it('should set status to Failure on error', () => {
      const request = { email: 'test@test.com', password: 'wrong' };

      authStore.signIn(request);

      const req = httpMock.expectOne((r) => r.url.includes('signin'));
      req.flush(
        {
          code: 401,
          reason: 'Invalid credentials',
          method: 'POST',
          path: '/signin',
          timestamp: '',
        },
        { status: 401, statusText: 'Unauthorized' },
      );

      expect(authStore.signInStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('signUp', () => {
    it('should set status to InProgress then Success on success', () => {
      const request = { email: 'new@test.com', password: 'pass123' };

      authStore.signUp(request);
      expect(authStore.signUpStatus()).toBe(OperationStatus.InProgress);

      const req = httpMock.expectOne((r) => r.url.includes('signup'));
      req.flush({ accessToken: 'token-456', refreshToken: 'refresh-456' });

      expect(authStore.signUpStatus()).toBe(OperationStatus.Success);
      expect(authStore.signUpResponse().token.accessToken).toBe('token-456');
    });

    it('should set status to Failure on error', () => {
      const request = { email: 'new@test.com', password: 'short' };

      authStore.signUp(request);

      const req = httpMock.expectOne((r) => r.url.includes('signup'));
      req.flush(
        { code: 400, reason: 'Bad request', method: 'POST', path: '/signup', timestamp: '' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(authStore.signUpStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('signOut', () => {
    it('should set status to InProgress then Success and reset store', () => {
      authStore.checkSuccess();
      expect(authStore.isCheckSuccess()).toBe(true);

      authStore.signOut();
      expect(authStore.signOutStatus()).toBe(OperationStatus.InProgress);

      const req = httpMock.expectOne((r) => r.url.includes('logout'));
      req.flush({});

      expect(authStore.signOutStatus()).toBe(OperationStatus.Success);
      expect(authStore.checkStatus()).toBe(OperationStatus.Initial);
      expect(authStore.isCheckSuccess()).toBe(false);
    });

    it('should set status to Failure on error', () => {
      authStore.signOut();

      const req = httpMock.expectOne((r) => r.url.includes('logout'));
      req.flush(
        { code: 500, reason: 'Server error', method: 'POST', path: '/logout', timestamp: '' },
        { status: 500, statusText: 'Server Error' },
      );

      expect(authStore.signOutStatus()).toBe(OperationStatus.Failure);
    });
  });
});
