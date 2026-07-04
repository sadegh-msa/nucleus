import { TestBed } from '@angular/core/testing';

import { CssSupportService } from './css-support.service';

describe('CssSupportService', () => {
  let service: CssSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calcSize', () => {
    it('should return a boolean indicating CSS calc-size support', () => {
      const result = service.calcSize();

      expect(typeof result).toBe('boolean');
    });

    it('should call CSS.supports with the correct argument', () => {
      const spy = jest.spyOn(CSS, 'supports');

      service.calcSize();

      expect(spy).toHaveBeenCalledWith('max-height: calc-size(max-content, size)');
    });
  });
});
