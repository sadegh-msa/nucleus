import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericListBuilder } from './generic-list-builder';

describe('GenericListBuilder', () => {
  let service: GenericListBuilder<any>;
  let router: { navigate: jest.Mock };
  let activatedRoute: any;

  beforeEach(() => {
    router = { navigate: jest.fn() };
    activatedRoute = {
      queryParams: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    };

    TestBed.configureTestingModule({
      providers: [
        GenericListBuilder,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });
    service = TestBed.inject(GenericListBuilder);
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
      list: () => ({
        status: 0,
        response: { data: [], control: { pagination: { page: 0, rows: 10, pages: 0, total: 0 } } },
        tool: null,
      }),
      delete: () => ({ status: 0, response: { data: '' }, tool: null }),
      loadList: jest.fn(),
      loadDelete: jest.fn(),
    },
    table: {
      columns: [],
      tools: [],
      events$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
    },
  };
}
