import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UiMessageManager } from '@nucleus/ui';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import { AuthToken } from '../services/auth-token';
import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  const mockMessage = {
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
    addSuccess: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    messages: { size: 0 },
  };

  const mockAuthToken = {
    getAccessToken: vi.fn().mockResolvedValue('test-token'),
    deleteAccessToken: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: UiMessageManager, useValue: mockMessage },
        { provide: AuthToken, useValue: mockAuthToken },
      ],
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header', async () => {
    const request = new HttpRequest('GET', '/api/test');
    const next = { handle: vi.fn().mockReturnValue(of({})) };

    await firstValueFrom(interceptor.intercept(request, next as any));

    expect(next.handle).toHaveBeenCalled();
    const cloned = next.handle.mock.calls[0][0];
    expect(cloned.headers.get('Authorization')).toBe('Bearer test-token');
  });
});
