import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { type Mock, vi } from 'vitest';

import { GenericListBuilder } from './generic-list-builder';

describe('GenericListBuilder', () => {
  let service: GenericListBuilder<any>;
  let router: { navigate: Mock };
  let activatedRoute: any;
  let queryParams: Subject<Record<string, string | number>>;

  beforeEach(() => {
    router = { navigate: vi.fn().mockResolvedValue(true) };
    queryParams = new Subject();
    activatedRoute = {
      queryParams,
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
      expect(() => service.run()).toThrow('It needs to call "init" method first!');
    });

    it('should load data from query params and create toolbar', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      TestBed.runInInjectionContext(() => service.run());
      queryParams.next({ page: 2, rows: 20 });

      expect(consumer.store.loadList).toHaveBeenCalledWith({ page: 1, rows: 20 }, undefined);
      expect(consumer.toolbar.tools.length).toBe(2);
      expect(consumer.toolbar.tools.map((tool: any) => tool.type)).toEqual(['add', 'refresh']);
    });

    it('should not create toolbar when createToolbar is false', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      queryParams.next({ page: 2, rows: 20 });
      TestBed.runInInjectionContext(() => service.run(false));

      expect(consumer.toolbar.tools.length).toBe(0);
    });
  });

  describe('router query param changes', () => {
    it('should reload when only page changes', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));
      queryParams.next({ page: 2, rows: 20 });
      (consumer.store.loadList as Mock).mockClear();

      queryParams.next({ page: 3, rows: 20 });

      expect(consumer.store.loadList).toHaveBeenCalledWith({ page: 2, rows: 20 }, undefined);
    });

    it('should reload when only rows changes', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));
      queryParams.next({ page: 2, rows: 20 });
      (consumer.store.loadList as Mock).mockClear();

      queryParams.next({ page: 2, rows: 50 });

      expect(consumer.store.loadList).toHaveBeenCalledWith({ page: 1, rows: 50 }, undefined);
    });

    it('should not reload when neither page nor rows changes', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));
      queryParams.next({ page: 2, rows: 20 });
      (consumer.store.loadList as Mock).mockClear();

      queryParams.next({ page: 2, rows: 20 });

      expect(consumer.store.loadList).not.toHaveBeenCalled();
    });
  });

  describe('loadData via toolbar refresh', () => {
    it('should load data with the refresh tool', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run());
      queryParams.next({ page: 2, rows: 20 });
      (consumer.store.loadList as Mock).mockClear();

      const refreshTool = consumer.toolbar.tools.find((tool: any) => tool.type === 'refresh');
      refreshTool.command();

      expect(consumer.store.loadList).toHaveBeenCalledWith({ page: 1, rows: 20 }, refreshTool);
    });
  });

  describe('table events', () => {
    it('should delete on table delete event', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run());
      queryParams.next({ page: 2, rows: 20 });

      const deleteTool = { type: 'delete', showLoading: signal(false) };
      consumer.table.events$.next({ tool: deleteTool, payload: 'item-1' });

      expect(consumer.store.loadDelete).toHaveBeenCalledWith('item-1', deleteTool);
    });

    it('should ignore non-delete table events', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run());

      consumer.table.events$.next({ tool: { type: 'view' }, payload: 'item-1' });

      expect(consumer.store.loadDelete).not.toHaveBeenCalled();
    });
  });

  describe('handleLoadDataEvents', () => {
    it('should set isBusy while in progress', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      const tool = { showLoading: signal(false) };
      consumer.store.list.set({
        status: 'inProgress' as any,
        response: { data: [], control: { pagination: { page: 0, rows: 10, pages: 0, total: 0 } } },
        tool,
      });
      TestBed.tick();

      expect(consumer.isBusy()).toBe(true);
      expect(tool.showLoading()).toBe(true);
    });

    it('should set data on success', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.list.set({
        status: 'success' as any,
        response: {
          data: [{ id: '1' }, { id: '2' }],
          control: { pagination: { page: 0, rows: 10, pages: 1, total: 2 } },
        },
        tool: null,
      });
      TestBed.tick();

      expect(consumer.data()).toEqual([{ id: '1' }, { id: '2' }]);
      expect(consumer.isBusy()).toBe(false);
    });
  });

  describe('handleDeleteEvents', () => {
    it('should reset delete and reload data on delete success', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));
      queryParams.next({ page: 2, rows: 20 });
      (consumer.store.resetDelete as Mock).mockClear();
      (consumer.store.loadList as Mock).mockClear();

      consumer.store.delete.set({
        status: 'success' as any,
        response: { data: '' },
        tool: null,
        query: { page: 1, rows: 20 },
      });
      TestBed.tick();

      expect(consumer.store.resetDelete).toHaveBeenCalled();
      expect(consumer.store.loadList).toHaveBeenCalledWith({ page: 1, rows: 20 }, undefined);
    });
  });

  describe('changeSelection', () => {
    it('should bind changeSelection through init', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      consumer.changeSelection([{ id: '1' }, { id: '2' }]);
      expect(consumer.selectedRecords()).toEqual([{ id: '1' }, { id: '2' }]);

      consumer.changeSelection({ id: '3' });
      expect(consumer.selectedRecords()).toEqual([{ id: '3' }]);
    });
  });

  describe('updateUrl', () => {
    it('should update url when pagination page changes', async () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));
      TestBed.tick();

      consumer.pagination.update((current: any) => ({ ...current, page: 3 }));
      TestBed.tick();
      await new Promise((resolve) => setTimeout(resolve));

      expect(router.navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({
          relativeTo: activatedRoute,
          queryParams: { rows: 10, page: 4 },
          queryParamsHandling: 'merge',
          preserveFragment: true,
          replaceUrl: true,
        }),
      );
    });
  });

  describe('init', () => {
    it('should initialize consumer signals', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.pagination).toBeDefined();
      expect(consumer.data).toBeDefined();
      expect(consumer.isBusy).toBeDefined();
      expect(consumer.selectedRecords).toBeDefined();
    });
  });
});

function createMockConsumer() {
  return {
    pagination: signal(null),
    data: signal([]),
    isBusy: signal(false),
    selectedRecords: signal([]),
    isEmbedded: signal(false),
    toolbar: { tools: [] } as any,
    changeSelection: vi.fn(),
    config: {
      path: {
        page: {
          list: () => ['/list'],
          add: () => ['/list/add'],
        },
      },
      field: { id: 'id', title: 'title' },
      permission: {
        action: {
          add: 'add',
          edit: 'edit',
          view: 'view',
          delete: 'delete',
          list: 'list',
        },
      },
    },
    store: {
      list: signal({
        status: 'initial' as any,
        response: { data: [], control: { pagination: { page: 0, rows: 10, pages: 0, total: 0 } } },
        tool: null as any,
      }),
      delete: signal({ status: 'initial' as any, response: { data: '' }, tool: null as any }),
      loadList: vi.fn(),
      loadDelete: vi.fn(),
      resetDelete: vi.fn(),
    },
    table: {
      columns: [],
      tools: [],
      events$: new Subject<any>(),
    },
  };
}
