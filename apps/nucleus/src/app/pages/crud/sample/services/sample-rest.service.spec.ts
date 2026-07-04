import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { SampleRestService } from './sample-rest.service';

describe('SampleRestService', () => {
  let service: SampleRestService;
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
        { provide: NU_COMMON_CONFIG, useValue: mockConfig },
      ],
    });
    service = TestBed.inject(SampleRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should be defined', () => {
      expect(service.list).toBeDefined();
    });

    it('should make a GET request to the samples endpoint', () => {
      const mockResponse = {
        data: [],
        control: { message: 'ok', pagination: { page: 1, rows: 10, total: 0 } },
      };

      service.list().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/samples');

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should pass query params to the request', () => {
      const query = { page: 2, rows: 20 };
      const mockResponse = {
        data: [],
        control: { message: 'ok', pagination: { page: 2, rows: 20, total: 0 } },
      };

      service.list(query).subscribe();

      const req = httpMock.expectOne((r) => r.url === 'http://localhost:3000/samples');

      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('rows')).toBe('20');
      req.flush(mockResponse);
    });
  });

  describe('get', () => {
    it('should be defined', () => {
      expect(service.get).toBeDefined();
    });

    it('should make a GET request with the given id', () => {
      const mockResponse = {
        data: { id: '1', code: 'S001', title: 'Sample 1' },
        control: { message: 'ok' },
      };

      service.get('1').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/samples/1');

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('add', () => {
    it('should be defined', () => {
      expect(service.add).toBeDefined();
    });

    it('should make a POST request with the given data', () => {
      const mockRequest = { code: 'S002', title: 'Sample 2' };
      const mockResponse = {
        data: { id: '2', ...mockRequest },
        control: { message: 'created' },
      };

      service.add(mockRequest as any).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/samples');

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should make a PATCH request with the given id and data', () => {
      const mockRequest = { title: 'Updated' };
      const mockResponse = {
        data: { id: '1', code: 'S001', ...mockRequest },
        control: { message: 'updated' },
      };

      service.update('1', mockRequest as any).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/samples/1');

      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(service.delete).toBeDefined();
    });

    it('should make a DELETE request with the given id', () => {
      const mockResponse = {
        data: '1',
        control: { message: 'deleted' },
      };

      service.delete('1').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/samples/1');

      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
