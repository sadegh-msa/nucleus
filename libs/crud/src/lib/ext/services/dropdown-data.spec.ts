import { TestBed } from '@angular/core/testing';
import { DropdownData } from './dropdown-data';

describe('DropdownData', () => {
  let service: DropdownData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropdownData],
    });
    service = TestBed.inject(DropdownData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should return dropdown data with options and icon signals', () => {
      const mockStore = {
        list: () => ({ status: 'initial', response: [] }),
      };

      const result = service.load(mockStore as any, 'list');

      expect(result).toHaveProperty('options');
      expect(result).toHaveProperty('icon');
    });

    it('should have default icon', () => {
      const mockStore = {
        list: () => ({ status: 'initial', response: [] }),
      };

      const result = service.load(mockStore as any, 'list');

      expect(result.icon()).toBe('pi pi-angle-down');
    });

    it('should have empty options by default', () => {
      const mockStore = {
        list: () => ({ status: 'initial', response: [] }),
      };

      const result = service.load(mockStore as any, 'list');

      expect(result.options()).toEqual([]);
    });
  });
});
