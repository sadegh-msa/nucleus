import { TestBed } from '@angular/core/testing';
import { MessageManager } from '@nucleus/ui';
import { AuthToken } from '../services/auth-token';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  const mockMessage = {
    addError: jest.fn(),
    addWarning: jest.fn(),
    addInfo: jest.fn(),
    addSuccess: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    messages: { size: 0 },
  };

  const mockAuthToken = {
    getAccessToken: jest.fn().mockReturnValue('test-token'),
    deleteAccessToken: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: MessageManager, useValue: mockMessage },
        { provide: AuthToken, useValue: mockAuthToken },
      ],
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header', () => {
    const request = new (jest.requireActual('@angular/common/http').HttpRequest)(
      'GET',
      '/api/test',
    );
    const handledReq = jest
      .fn()
      .mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) });

    interceptor.intercept(request, { handle: handledReq } as any);

    expect(handledReq).toHaveBeenCalled();
    const cloned = handledReq.mock.calls[0][0];
    expect(cloned.headers.get('Authorization')).toBe('Bearer test-token');
  });
});
