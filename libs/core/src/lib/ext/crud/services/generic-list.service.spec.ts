import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { GenericListService } from './generic-list.service';

describe('GenericListService', () => {
  let service: GenericListService<any>;
  let _store: MockStore;
  let router: { navigate: jest.Mock };
  let activatedRoute: any;

  beforeEach(() => {
    router = { navigate: jest.fn() };
    activatedRoute = {
      queryParams: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    };

    TestBed.configureTestingModule({
      providers: [
        GenericListService,
        provideMockStore({ initialState: {} }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });
    service = TestBed.inject(GenericListService);
    _store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    it('should throw error when init not called', () => {
      expect(() => service.run()).toThrow('It needs to be call "init" method at first!');
    });
  });

  describe('init', () => {
    it('should initialize consumer signals', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.pagination).toBeDefined();
      expect(consumer.data).toBeDefined();
      expect(consumer.isDataLoading).toBeDefined();
      expect(consumer.selectedRecords).toBeDefined();
    });
  });
});

function createMockConsumer() {
  return {
    pagination: signal(null),
    data: signal([]),
    isDataLoading: signal(false),
    selectedRecords: signal([]),
    isEmbedded: signal(false),
    toolbar: { tools: [] } as any,
    changeSelection: jest.fn(),
    config: { path: { page: { list: () => ['/list'] } } },
    store: {
      selectors: {
        list: { state: jest.fn() },
        delete: { state: jest.fn() },
      },
      actions: {
        list: jest.fn(),
        delete: jest.fn(),
      },
    },
    table: {
      columns: [],
      tools: [],
      events$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    },
  };
}
