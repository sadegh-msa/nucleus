import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNuCommonConfig } from '@nucleus/common';
import { RestApiService } from './rest-api.service';

describe('RestApiService', () => {
  let service: RestApiService;

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
    service = TestBed.inject(RestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUrl', () => {
    it('should create URL with base and path', () => {
      const url = service.createUrl('users');

      expect(url).toBe('http://localhost:3000/users');
    });

    it('should create URL with multiple paths', () => {
      const url = service.createUrl('users', '123');

      expect(url).toBe('http://localhost:3000/users/123');
    });

    it('should create URL with nested paths', () => {
      const url = service.createUrl('users', '123', 'posts');

      expect(url).toBe('http://localhost:3000/users/123/posts');
    });

    it('should filter out empty paths', () => {
      const url = service.createUrl('users', '', 'posts');

      expect(url).toBe('http://localhost:3000/users/posts');
    });

    it('should handle no paths', () => {
      const url = service.createUrl();

      expect(url).toBe('http://localhost:3000');
    });
  });

  describe('createListHttpParams', () => {
    it('should create params with page and rows', () => {
      const params = service.createListHttpParams({ page: 1, rows: 10 });

      expect(params.get('page')).toBe('1');
      expect(params.get('rows')).toBe('10');
    });

    it('should create params with order', () => {
      const params = service.createListHttpParams({
        order: { name: 'asc' as any },
      });

      expect(params.get('order')).toBeTruthy();
    });

    it('should create params with filter', () => {
      const params = service.createListHttpParams({
        filter: { name: 'test' },
      });

      expect(params.get('filter')).toBeTruthy();
    });

    it('should create params with fields', () => {
      const params = service.createListHttpParams({
        fields: ['name', 'email'],
      });

      expect(params.get('fields')).toBe('name,email');
    });

    it('should return empty params for empty query', () => {
      const params = service.createListHttpParams({});

      expect(params.keys().length).toBe(0);
    });

    it('should return empty params when no query provided', () => {
      const params = service.createListHttpParams();

      expect(params.keys().length).toBe(0);
    });

    it('should not include non-integer page values', () => {
      const params = service.createListHttpParams({ page: 1.5 });

      expect(params.get('page')).toBeNull();
    });

    it('should not include non-integer rows values', () => {
      const params = service.createListHttpParams({ rows: 10.5 });

      expect(params.get('rows')).toBeNull();
    });
  });
});
