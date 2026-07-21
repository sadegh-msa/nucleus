import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UiMessageManager } from '@nucleus/ui';
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
    getAccessToken: vi.fn().mockReturnValue('test-token'),
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

  it('should add Authorization header', () => {
    const request = new HttpRequest('GET', '/api/test');
    const handledReq = vi
      .fn()
      .mockReturnValue({ pipe: vi.fn().mockReturnValue({ subscribe: vi.fn() }) });

    interceptor.intercept(request, { handle: handledReq } as any);

    expect(handledReq).toHaveBeenCalled();
    const cloned = handledReq.mock.calls[0][0];
    expect(cloned.headers.get('Authorization')).toBe('Bearer test-token');
  });
});
