import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CookieService, NU_COMMON_CONFIG } from '@nucleus/common';
import { NU_AUTH_CONFIG } from '../providers/auth-config.provider';
import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let _store: MockStore;
  let cookieService: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    deleteItem: jest.Mock;
  };

  const mockAuthConfig = {
    rememberMeExpiry: 60,
  };

  const mockCommonConfig = {
    api: {
      rest: { url: 'http://localhost', path: '/api', time: '1000' },
    },
    branding: {} as any,
    links: { customerAgreement: '', privacyPolicy: '' },
    crypto: {
      algorithm: { name: 'AES-CTR' as const, length: 256 },
      secureKey: 'test-key',
    },
  };

  beforeEach(() => {
    cookieService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      deleteItem: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: {} }),
        { provide: NU_AUTH_CONFIG, useValue: mockAuthConfig },
        { provide: NU_COMMON_CONFIG, useValue: mockCommonConfig },
        { provide: CookieService, useValue: cookieService },
      ],
    });
    _store = TestBed.inject(MockStore);
    service = TestBed.inject(AuthTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthRouteActivated', () => {
    it('should return true for auth routes', () => {
      expect(service.isAuthRouteActivated('/signin')).toBe(true);
      expect(service.isAuthRouteActivated('/signup')).toBe(true);
    });

    it('should return false for non-auth routes', () => {
      expect(service.isAuthRouteActivated('/signout')).toBe(false);
      expect(service.isAuthRouteActivated('/dashboard')).toBe(false);
      expect(service.isAuthRouteActivated('/users')).toBe(false);
      expect(service.isAuthRouteActivated('/')).toBe(false);
    });

    it('should handle routes with hash', () => {
      expect(service.isAuthRouteActivated('/signin#modal')).toBe(true);
    });
  });
});
