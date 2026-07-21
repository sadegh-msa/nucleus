import { TestBed } from '@angular/core/testing';
import { CookieManager, provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { provideAuthConfig } from '../providers/auth-config-provider';
import { provideAuthStore } from '../store/auth-store';
import { AuthToken } from './auth-token';

setupGlobalMocks();

describe('AuthToken', () => {
  let service: AuthToken;
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
        provideAuthStore(),
        provideAuthConfig(mockAuthConfig),
        provideNuCommonConfig(mockCommonConfig),
        provideUiConfig(MOCK_UI_CONFIG),
        { provide: CookieManager, useValue: cookieService },
      ],
    });
    service = TestBed.inject(AuthToken);
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
