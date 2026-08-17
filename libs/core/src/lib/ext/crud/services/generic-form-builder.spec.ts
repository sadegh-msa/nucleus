import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { type Mock, vi } from 'vitest';
import { GenericFormBuilder } from './generic-form-builder';

interface MockForm {
  markAsTouched: Mock;
  invalid: Mock;
  value: Mock;
}

describe('GenericFormBuilder', () => {
  let service: GenericFormBuilder<any>;
  let router: { navigate: Mock };

  beforeEach(() => {
    router = { navigate: vi.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [GenericFormBuilder, { provide: Router, useValue: router }],
    });
    service = TestBed.inject(GenericFormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    it('should throw error when init not called', () => {
      expect(() => service.run()).toThrow('It needs to call "init" method first!');
    });
  });

  describe('init', () => {
    it('should initialize consumer signals', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.data).toBeDefined();
      expect(consumer.title).toBeDefined();
      expect(consumer.isBusy).toBeDefined();
      expect(consumer.onSubmit).toBeDefined();
    });

    it('should set default title to ...', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.title()).toBe('...');
    });
  });

  describe('save', () => {
    it('should mark form as touched', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.save();

      expect(consumer.form().markAsTouched).toHaveBeenCalled();
    });

    it('should return early when form is invalid', () => {
      const consumer = createMockConsumer();
      consumer.form().invalid.mockReturnValue(true);
      service.init(consumer as any);

      service.save();

      expect(consumer.store.loadAdd).not.toHaveBeenCalled();
      expect(consumer.store.loadUpdate).not.toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    it('should not load data for Add page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);

      service.loadData();

      expect(consumer.store.loadGet).not.toHaveBeenCalled();
    });

    it('should load data for View page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('view');
      service.init(consumer as any);

      service.loadData();

      expect(consumer.store.loadGet).toHaveBeenCalled();
    });
  });

  describe('navigateToListPage', () => {
    it('should navigate to list page', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.navigateToListPage();

      expect(router.navigate).toHaveBeenCalledWith(['/list']);
    });
  });

  describe('navigateToViewPage', () => {
    it('should navigate to view page', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.navigateToViewPage();

      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('createToolbar', () => {
    it('should create view toolbar', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('view');
      service.init(consumer as any);

      const toolbar = service.createToolbar(false);

      expect(toolbar.tools.length).toBeGreaterThan(0);
    });

    it('should create add toolbar', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);

      const toolbar = service.createToolbar(false);

      expect(toolbar.tools.length).toBeGreaterThan(0);
    });

    it('should create edit toolbar', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('edit');
      service.init(consumer as any);

      const toolbar = service.createToolbar(false);

      expect(toolbar.tools.length).toBeGreaterThan(0);
    });
  });
});

function createMockConsumer() {
  const mockForm: MockForm = {
    markAsTouched: vi.fn(),
    invalid: vi.fn().mockReturnValue(false),
    value: vi.fn().mockReturnValue({ name: '', title: '' }),
  };

  const formSignal = signal(mockForm);

  return {
    data: signal({}),
    title: signal('...'),
    isBusy: signal(false),
    form: formSignal,
    formModel: signal({ name: '', title: '' }),
    id: signal('123'),
    inputId: signal(''),
    pageType: signal('view'),
    isEmbedded: signal(false),
    onSubmit: vi.fn(),
    config: {
      path: {
        page: {
          list: () => ['/list'],
          view: (id: string) => [`/view/${id}`],
          edit: (id: string) => [`/edit/${id}`],
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
      get: () => ({ status: 0, response: { data: {} }, tool: null }),
      add: () => ({ status: 0, response: { data: {} }, tool: null }),
      update: () => ({ status: 0, response: { data: {} }, tool: null }),
      delete: () => ({ status: 0, response: { data: '' }, tool: null }),
      loadGet: vi.fn(),
      loadAdd: vi.fn(),
      loadUpdate: vi.fn(),
      loadDelete: vi.fn(),
      resetGet: vi.fn(),
      resetAdd: vi.fn(),
      resetUpdate: vi.fn(),
      resetDelete: vi.fn(),
      mutateGet: vi.fn(),
    },
    toolbar: { tools: [] },
    navigationState: undefined,
  };
}
