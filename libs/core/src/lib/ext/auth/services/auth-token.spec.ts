import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationCancel, Router } from '@angular/router';
import {
  CookieManager,
  type OperationStatusType,
  PermanentStorage,
  provideNuCommonConfig,
} from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { type Observable, Subject } from 'rxjs';
import { type Mock, vi } from 'vitest';
import { provideAuthConfig } from '../providers/auth-config-provider';
import { provideAuthStore } from '../store/auth-store';
import { AuthToken } from './auth-token';

setupGlobalMocks();

const flushEffects = (globalThis as Record<string, unknown>)['flush'] as () => Promise<void>;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function settle() {
  for (let i = 0; i < 3; i++) {
    await sleep(40);
    await flushEffects();
  }
}

function createMockAuthStore() {
  const checkStatus = signal<OperationStatusType>('initial');
  const signInStatus = signal<OperationStatusType>('initial');
  const signUpStatus = signal<OperationStatusType>('initial');
  const signOutStatus = signal<OperationStatusType>('initial');
  const signInToken = signal<string | null>(null);
  const signUpToken = signal<string | null>(null);

  const signInState = computed(() => ({
    request: { email: '', password: '' },
    response: { token: { accessToken: signInToken(), refreshToken: null } },
    message: '',
    status: signInStatus(),
  }));
  const signUpState = computed(() => ({
    request: { email: '', password: '' },
    response: { token: { accessToken: signUpToken(), refreshToken: null } },
    message: '',
    status: signUpStatus(),
  }));
  const signOutState = computed(() => ({ message: '', status: signOutStatus() }));

  return {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    checkSuccess: vi.fn(() => checkStatus.set('success')),
    checkFailure: vi.fn(() => checkStatus.set('failure')),
    checkStatus: () => checkStatus(),
    signInStatus: () => signInStatus(),
    signUpStatus: () => signUpStatus(),
    signOutStatus: () => signOutStatus(),
    isCheckSuccess: () => checkStatus() === 'success',
    signInResponse: () => signInState().response,
    signUpResponse: () => signUpState().response,
    signInState: () => signInState(),
    signUpState: () => signUpState(),
    signOutState: () => signOutState(),
    checkState: () => ({ status: checkStatus() }),
    _setCheck(status: OperationStatusType) {
      checkStatus.set(status);
    },
    _setSignIn(status: OperationStatusType, accessToken: string | null = null) {
      signInToken.set(accessToken);
      signInStatus.set(status);
    },
    _setSignUp(status: OperationStatusType, accessToken: string | null = null) {
      signUpToken.set(accessToken);
      signUpStatus.set(status);
    },
    _setSignOut(status: OperationStatusType) {
      signOutStatus.set(status);
    },
  };
}

describe('AuthToken', () => {
  let service: AuthToken;
  let cookieValue: string | null;
  let cookieService: {
    getItem: Mock;
    setItem: Mock;
    deleteItem: Mock;
  };
  let permanentStorage: { getItem: Mock; setItem: Mock };
  let routerNavigate: Mock;
  let routerEvents$: Subject<NavigationCancel>;
  let authStore: ReturnType<typeof createMockAuthStore>;

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
    history.replaceState({}, '', '/');
    cookieValue = null;
    cookieService = {
      getItem: vi.fn(() => cookieValue),
      setItem: vi.fn((_key: string, value: string | null) => {
        cookieValue = value;
      }),
      deleteItem: vi.fn(() => {
        cookieValue = null;
      }),
    };
    permanentStorage = {
      getItem: vi.fn(() => ''),
      setItem: vi.fn(),
    };
    routerNavigate = vi.fn(() => Promise.resolve(true));
    routerEvents$ = new Subject<NavigationCancel>();
    authStore = createMockAuthStore();

    TestBed.configureTestingModule({
      providers: [
        provideAuthStore({ useValue: authStore }),
        provideAuthConfig(mockAuthConfig),
        provideNuCommonConfig(mockCommonConfig),
        provideUiConfig(MOCK_UI_CONFIG),
        { provide: CookieManager, useValue: cookieService },
        { provide: PermanentStorage, useValue: permanentStorage },
        {
          provide: Router,
          useValue: {
            navigate: routerNavigate,
            events: routerEvents$.asObservable() as Observable<unknown>,
          },
        },
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

  describe('getAccessToken', () => {
    it('should return null when no access token cookie exists', async () => {
      await settle();

      expect(await service.getAccessToken()).toBeNull();
    });
  });

  describe('setAccessToken', () => {
    it('should store the token in the cookie with the remember me expiry', async () => {
      await settle();

      await service.setAccessToken('my-token');
      await settle();

      expect(cookieService.setItem).toHaveBeenCalledWith('aat', 'my-token', 60);
      expect(await service.getAccessToken()).toBe('my-token');
    });
  });

  describe('deleteAccessToken', () => {
    it('should delete the access token cookie and clear the cached token', async () => {
      await settle();
      await service.setAccessToken('my-token');
      await settle();

      await service.deleteAccessToken();
      await settle();

      expect(cookieService.deleteItem).toHaveBeenCalledWith('aat');
      expect(await service.getAccessToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when there is no access token', async () => {
      await settle();

      expect(await service.isAuthenticated()).toBe(false);
    });

    it('should return true when an access token exists', async () => {
      await settle();
      await service.setAccessToken('my-token');
      await settle();

      expect(await service.isAuthenticated()).toBe(true);
    });
  });

  describe('token check', () => {
    it('should report check failure when there is no access token', async () => {
      await settle();

      expect(authStore.checkFailure).toHaveBeenCalled();
      expect(authStore.checkSuccess).not.toHaveBeenCalled();
    });

    it('should report check success after a token is stored', async () => {
      await settle();
      vi.clearAllMocks();

      await service.setAccessToken('my-token');
      await settle();

      expect(authStore.checkSuccess).toHaveBeenCalled();
    });
  });

  describe('navigation cancel handling', () => {
    it('should store the requested url when unauthenticated on a non-auth route', async () => {
      await settle();

      routerEvents$.next(new NavigationCancel(1, '/protected', 'test'));
      await settle();

      expect(permanentStorage.setItem).toHaveBeenCalledWith('requestedUrl', '/protected');
    });

    it('should not store the requested url when authenticated', async () => {
      await settle();
      await service.setAccessToken('my-token');
      await settle();
      vi.clearAllMocks();

      routerEvents$.next(new NavigationCancel(1, '/protected', 'test'));
      await settle();

      expect(permanentStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not store the requested url for auth routes', async () => {
      await settle();

      routerEvents$.next(new NavigationCancel(1, '/signin', 'test'));
      await settle();

      expect(permanentStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('check status handling', () => {
    it('should redirect to the stored requested url and clear it on success', async () => {
      await settle();
      permanentStorage.getItem.mockReturnValue('/dashboard');
      vi.clearAllMocks();

      authStore._setCheck('success');
      await settle();

      expect(routerNavigate).toHaveBeenCalledWith(['/dashboard']);
      expect(permanentStorage.setItem).toHaveBeenCalledWith('requestedUrl', '');
    });

    it('should not redirect on success when no requested url is stored', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setCheck('success');
      await settle();

      expect(permanentStorage.getItem).toHaveBeenCalledWith('requestedUrl');
      expect(routerNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to the sign-in page on failure', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setCheck('success');
      authStore._setCheck('failure');
      await settle();

      expect(routerNavigate).toHaveBeenCalledWith(['/', 'signin']);
    });

    it('should fall back to the home page when navigation fails', async () => {
      await settle();
      vi.clearAllMocks();
      permanentStorage.getItem.mockReturnValue('/broken');
      routerNavigate.mockRejectedValueOnce(new Error('navigation failed'));

      authStore._setCheck('success');
      await settle();

      expect(routerNavigate).toHaveBeenNthCalledWith(1, ['/broken']);
      expect(routerNavigate).toHaveBeenNthCalledWith(2, ['/']);
    });
  });

  describe('sign-in state handling', () => {
    it('should store the token and redirect on success', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setSignIn('success', 'sign-in-token');
      await settle();

      expect(cookieService.setItem).toHaveBeenCalledWith('aat', 'sign-in-token', 60);
      expect(routerNavigate).toHaveBeenCalledWith(['/']);
      expect(authStore.checkSuccess).toHaveBeenCalled();
    });

    it('should delete the token on failure', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setSignIn('failure');
      await settle();

      expect(cookieService.deleteItem).toHaveBeenCalledWith('aat');
    });
  });

  describe('sign-up state handling', () => {
    it('should store the token and redirect on success', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setSignUp('success', 'sign-up-token');
      await settle();

      expect(cookieService.setItem).toHaveBeenCalledWith('aat', 'sign-up-token', 60);
      expect(routerNavigate).toHaveBeenCalledWith(['/']);
      expect(authStore.checkSuccess).toHaveBeenCalled();
    });

    it('should delete the token on failure', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setSignUp('failure');
      await settle();

      expect(cookieService.deleteItem).toHaveBeenCalledWith('aat');
    });
  });

  describe('sign-out state handling', () => {
    it('should clear the requested url and delete the token on success', async () => {
      await settle();
      vi.clearAllMocks();

      authStore._setSignOut('success');
      await settle();

      expect(permanentStorage.setItem).toHaveBeenCalledWith('requestedUrl', '');
      expect(cookieService.deleteItem).toHaveBeenCalledWith('aat');
    });
  });
});
