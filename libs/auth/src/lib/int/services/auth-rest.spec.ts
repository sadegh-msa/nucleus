import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '@nucleus/common';
import { AuthRest } from './auth-rest';

describe('AuthRest', () => {
  let service: AuthRest;
  let httpMock: HttpTestingController;

  const mockConfig = {
    api: {
      rest: { url: 'http://localhost:3000', path: '/api', time: '1000' },
    },
    branding: {} as any,
    links: { customerAgreement: '', privacyPolicy: '' },
    crypto: {
      algorithm: { name: 'AES-CTR' as const, length: 256 },
      secureKey: 'test-key',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNuCommonConfig(mockConfig),
      ],
    });
    service = TestBed.inject(AuthRest);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUrl', () => {
    it('should create URL with endpoint', () => {
      const url = service.createUrl('signin');

      expect(url).toContain('signin');
    });
  });

  describe('signIn', () => {
    it('should POST to signin endpoint', () => {
      const mockData = { email: 'test@test.com', password: 'password' };

      service.signIn(mockData as any).subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('signin'));

      expect(req.request.method).toBe('POST');
      req.flush({ accessToken: 'token123' });
    });
  });

  describe('signUp', () => {
    it('should POST to signup endpoint', () => {
      const mockData = { email: 'test@test.com', password: 'password', name: 'Test' };

      service.signUp(mockData as any).subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('signup'));

      expect(req.request.method).toBe('POST');
      req.flush({ accessToken: 'token123' });
    });
  });

  describe('signOut', () => {
    it('should POST to signout endpoint', () => {
      service.signOut().subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('signout'));

      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('refresh', () => {
    it('should POST to refresh endpoint', () => {
      service.refresh().subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('refresh'));

      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
