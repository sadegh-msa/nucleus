import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OperationStatus } from '@nucleus/common';
import { DropdownDataService } from './dropdown-data.service';

describe('DropdownDataService', () => {
  let service: DropdownDataService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropdownDataService, provideMockStore({ initialState: {} })],
    });
    service = TestBed.inject(DropdownDataService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should return dropdown data with options and icon signals', () => {
      const selector = () => ({ status: OperationStatus.Initial, response: [] });

      const result = service.load(store as any, selector);

      expect(result).toHaveProperty('options');
      expect(result).toHaveProperty('icon');
    });

    it('should have default icon', () => {
      const selector = () => ({ status: OperationStatus.Initial, response: [] });

      const result = service.load(store as any, selector);

      expect(result.icon()).toBe('pi pi-angle-down');
    });

    it('should have empty options by default', () => {
      const selector = () => ({ status: OperationStatus.Initial, response: [] });

      const result = service.load(store as any, selector);

      expect(result.options()).toEqual([]);
    });
  });
});
