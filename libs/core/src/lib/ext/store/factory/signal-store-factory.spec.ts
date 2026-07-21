import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OperationStatus, provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { type Mock, vi } from 'vitest';
import { of, Subject, throwError } from 'rxjs';
import { createCrudSignalStore } from './signal-store-factory';

setupGlobalMocks();

interface TestItem {
  id: string;
  name: string;
}

interface TestCreate {
  name: string;
}

describe('createCrudSignalStore', () => {
  let store: any;
  let mockRest: {
    list: Mock;
    get: Mock;
    add: Mock;
    update: Mock;
    delete: Mock;
  };

  beforeEach(() => {
    mockRest = {
      list: vi.fn(),
      get: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const TestStore = createCrudSignalStore<any, TestCreate, TestItem>(
      { title: 'Test Item' },
      () => mockRest as any,
    );

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
    });

    store = TestBed.inject(TestStore);
  });

  describe('initial state', () => {
    it('should have Initial status for all operations', () => {
      expect(store.listStatus()).toBe(OperationStatus.Initial);
      expect(store.getStatus()).toBe(OperationStatus.Initial);
      expect(store.addStatus()).toBe(OperationStatus.Initial);
      expect(store.updateStatus()).toBe(OperationStatus.Initial);
      expect(store.deleteStatus()).toBe(OperationStatus.Initial);
    });

    it('should have empty initial responses', () => {
      expect(store.listResponse().data).toEqual([]);
      expect(store.getResponse().data).toEqual({});
      expect(store.addResponse().data).toEqual({});
      expect(store.updateResponse().data).toEqual({});
      expect(store.deleteResponse().data).toBe('');
    });
  });

  describe('loadList', () => {
    it('should set status to Success on success', () => {
      const query = { page: 0, rows: 10 };
      const response = {
        control: { pagination: { first: 0, page: 0, rows: 10, pages: 1, total: 2 } },
        data: [{ id: '1', name: 'Item 1' }],
      };

      mockRest.list.mockReturnValue(of(response));

      store.loadList(query);

      expect(store.listStatus()).toBe(OperationStatus.Success);
      expect(store.listResponse().data).toEqual(response.data);
    });

    it('should show InProgress while request is pending', () => {
      const subject = new Subject<any>();
      mockRest.list.mockReturnValue(subject.asObservable());

      store.loadList({ page: 0, rows: 10 });
      expect(store.listStatus()).toBe(OperationStatus.InProgress);

      subject.next({ control: {}, data: [] });
      subject.complete();

      expect(store.listStatus()).toBe(OperationStatus.Success);
    });

    it('should set status to Failure on error', () => {
      mockRest.list.mockReturnValue(
        throwError(() => ({
          error: {
            code: 500,
            reason: 'Server error',
            method: 'GET',
            path: '/items',
            timestamp: '',
          },
        })),
      );

      store.loadList({ page: 0, rows: 10 });

      expect(store.listStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('loadGet', () => {
    it('should set status to Success on success', () => {
      const response = {
        control: {},
        data: { id: '1', name: 'Item 1' },
      };

      mockRest.get.mockReturnValue(of(response));

      store.loadGet('1');

      expect(store.getStatus()).toBe(OperationStatus.Success);
      expect(store.getResponse().data).toEqual(response.data);
    });

    it('should show InProgress while request is pending', () => {
      const subject = new Subject<any>();
      mockRest.get.mockReturnValue(subject.asObservable());

      store.loadGet('1');
      expect(store.getStatus()).toBe(OperationStatus.InProgress);

      subject.next({ control: {}, data: { id: '1', name: 'Item' } });
      subject.complete();

      expect(store.getStatus()).toBe(OperationStatus.Success);
    });

    it('should set status to Failure when query is empty', () => {
      store.loadGet('');

      expect(store.getStatus()).toBe(OperationStatus.Failure);
    });

    it('should set status to Failure on error', () => {
      mockRest.get.mockReturnValue(
        throwError(() => ({
          error: { code: 404, reason: 'Not found', method: 'GET', path: '/items/1', timestamp: '' },
        })),
      );

      store.loadGet('1');

      expect(store.getStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('loadAdd', () => {
    it('should set status to Success on success', () => {
      const request = { name: 'New Item' };
      const response = {
        control: {},
        data: { id: '2', name: 'New Item' },
      };

      mockRest.add.mockReturnValue(of(response));

      store.loadAdd(request);

      expect(store.addStatus()).toBe(OperationStatus.Success);
      expect(store.addResponse().data).toEqual(response.data);
    });

    it('should show InProgress while request is pending', () => {
      const subject = new Subject<any>();
      mockRest.add.mockReturnValue(subject.asObservable());

      store.loadAdd({ name: 'Item' });
      expect(store.addStatus()).toBe(OperationStatus.InProgress);

      subject.next({ control: {}, data: { id: '1', name: 'Item' } });
      subject.complete();

      expect(store.addStatus()).toBe(OperationStatus.Success);
    });

    it('should set status to Failure on error', () => {
      mockRest.add.mockReturnValue(
        throwError(() => ({
          error: {
            code: 400,
            reason: 'Bad request',
            method: 'POST',
            path: '/items',
            timestamp: '',
          },
        })),
      );

      store.loadAdd({ name: 'Bad Item' });

      expect(store.addStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('loadUpdate', () => {
    it('should set status to Success on success', () => {
      const request = { name: 'Updated Item' };
      const response = {
        control: {},
        data: { id: '1', name: 'Updated Item' },
      };

      mockRest.update.mockReturnValue(of(response));

      store.loadUpdate('1', request);

      expect(store.updateStatus()).toBe(OperationStatus.Success);
      expect(store.updateResponse().data).toEqual(response.data);
    });

    it('should show InProgress while request is pending', () => {
      const subject = new Subject<any>();
      mockRest.update.mockReturnValue(subject.asObservable());

      store.loadUpdate('1', { name: 'Item' });
      expect(store.updateStatus()).toBe(OperationStatus.InProgress);

      subject.next({ control: {}, data: { id: '1', name: 'Item' } });
      subject.complete();

      expect(store.updateStatus()).toBe(OperationStatus.Success);
    });

    it('should set status to Failure when query is empty', () => {
      store.loadUpdate('', { name: 'Item' });

      expect(store.updateStatus()).toBe(OperationStatus.Failure);
    });

    it('should set status to Failure on error', () => {
      mockRest.update.mockReturnValue(
        throwError(() => ({
          error: {
            code: 404,
            reason: 'Not found',
            method: 'PATCH',
            path: '/items/1',
            timestamp: '',
          },
        })),
      );

      store.loadUpdate('1', { name: 'Item' });

      expect(store.updateStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('loadDelete', () => {
    it('should set status to Success on success', () => {
      mockRest.delete.mockReturnValue(of({ control: {}, data: '1' } as any));

      store.loadDelete('1');

      expect(store.deleteStatus()).toBe(OperationStatus.Success);
      expect(store.deleteResponse().data).toBe('1');
    });

    it('should show InProgress while request is pending', () => {
      const subject = new Subject<any>();
      mockRest.delete.mockReturnValue(subject.asObservable());

      store.loadDelete('1');
      expect(store.deleteStatus()).toBe(OperationStatus.InProgress);

      subject.next({ control: {}, data: '1' });
      subject.complete();

      expect(store.deleteStatus()).toBe(OperationStatus.Success);
    });

    it('should set status to Failure when query is empty', () => {
      store.loadDelete('');

      expect(store.deleteStatus()).toBe(OperationStatus.Failure);
    });

    it('should set status to Failure on error', () => {
      mockRest.delete.mockReturnValue(
        throwError(() => ({
          error: {
            code: 404,
            reason: 'Not found',
            method: 'DELETE',
            path: '/items/1',
            timestamp: '',
          },
        })),
      );

      store.loadDelete('1');

      expect(store.deleteStatus()).toBe(OperationStatus.Failure);
    });
  });

  describe('getMutate', () => {
    it('should update get response and reset status to Initial', () => {
      const response = { id: '1', name: 'Mutated Item' };

      store.getMutate(response);

      expect(store.getResponse().data).toEqual(response);
      expect(store.getStatus()).toBe(OperationStatus.Initial);
    });
  });

  describe('reset methods', () => {
    it('should reset list state', () => {
      mockRest.list.mockReturnValue(of({ control: {}, data: [{ id: '1', name: 'Item' }] }));
      store.loadList({ page: 0, rows: 10 });
      expect(store.listStatus()).toBe(OperationStatus.Success);

      store.resetList();
      expect(store.listStatus()).toBe(OperationStatus.Initial);
      expect(store.listResponse().data).toEqual([]);
    });

    it('should reset get state', () => {
      mockRest.get.mockReturnValue(of({ control: {}, data: { id: '1', name: 'Item' } }));
      store.loadGet('1');
      expect(store.getStatus()).toBe(OperationStatus.Success);

      store.resetGet();
      expect(store.getStatus()).toBe(OperationStatus.Initial);
      expect(store.getResponse().data).toEqual({});
    });

    it('should reset add state', () => {
      mockRest.add.mockReturnValue(of({ control: {}, data: { id: '1', name: 'Item' } }));
      store.loadAdd({ name: 'Item' });
      expect(store.addStatus()).toBe(OperationStatus.Success);

      store.resetAdd();
      expect(store.addStatus()).toBe(OperationStatus.Initial);
    });

    it('should reset update state', () => {
      mockRest.update.mockReturnValue(of({ control: {}, data: { id: '1', name: 'Item' } }));
      store.loadUpdate('1', { name: 'Item' });
      expect(store.updateStatus()).toBe(OperationStatus.Success);

      store.resetUpdate();
      expect(store.updateStatus()).toBe(OperationStatus.Initial);
    });

    it('should reset delete state', () => {
      mockRest.delete.mockReturnValue(of({ control: {}, data: '1' } as any));
      store.loadDelete('1');
      expect(store.deleteStatus()).toBe(OperationStatus.Success);

      store.resetDelete();
      expect(store.deleteStatus()).toBe(OperationStatus.Initial);
    });

    it('should reset all states', () => {
      mockRest.list.mockReturnValue(of({ control: {}, data: [{ id: '1', name: 'Item' }] }));
      mockRest.get.mockReturnValue(of({ control: {}, data: { id: '1', name: 'Item' } }));
      store.loadList({ page: 0, rows: 10 });
      store.loadGet('1');

      store.resetAll();

      expect(store.listStatus()).toBe(OperationStatus.Initial);
      expect(store.getStatus()).toBe(OperationStatus.Initial);
      expect(store.addStatus()).toBe(OperationStatus.Initial);
      expect(store.updateStatus()).toBe(OperationStatus.Initial);
      expect(store.deleteStatus()).toBe(OperationStatus.Initial);
    });
  });

  describe('tool support', () => {
    it('should pass tool to state on loadList', () => {
      const tool = { showLoading: { set: vi.fn() } } as any;
      mockRest.list.mockReturnValue(of({ control: {}, data: [] }));

      store.loadList({ page: 0, rows: 10 }, tool);

      expect(store.list().tool).toBe(tool);
    });
  });
});
