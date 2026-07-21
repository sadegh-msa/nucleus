import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UiCssSupport } from './css-support';

describe('UiCssSupport', () => {
  let service: UiCssSupport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiCssSupport);
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
      const spy = vi.spyOn(CSS, 'supports');

      service.calcSize();

      expect(spy).toHaveBeenCalledWith('max-height: calc-size(max-content, size)');
    });
  });
});
