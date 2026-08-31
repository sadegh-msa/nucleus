import { TestBed } from '@angular/core/testing';
import { type ActivatedRouteSnapshot, Router, type RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';
import { AuthToken } from '../services/auth-token';
import { authCanActivate } from './auth-guard';

describe('authCanActivate', () => {
  const mockAuthToken = {
    isAuthenticated: vi.fn(),
    isAuthRouteActivated: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthToken, useValue: mockAuthToken },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when authenticated and not on auth route', async () => {
    mockAuthToken.isAuthenticated.mockResolvedValue(true);
    mockAuthToken.isAuthRouteActivated.mockReturnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(async () => {
      const result = await authCanActivate(route, state);
      expect(result).toBe(true);
    });
  });

  it('should deny access when not authenticated', async () => {
    mockAuthToken.isAuthenticated.mockResolvedValue(false);
    mockAuthToken.isAuthRouteActivated.mockReturnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(async () => {
      const result = await authCanActivate(route, state);
      expect(result).toBe(false);
    });
  });

  it('should deny access when on auth route even if authenticated', async () => {
    mockAuthToken.isAuthenticated.mockResolvedValue(true);
    mockAuthToken.isAuthRouteActivated.mockReturnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/signin' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(async () => {
      const result = await authCanActivate(route, state);
      expect(result).toBe(false);
    });
  });
});
