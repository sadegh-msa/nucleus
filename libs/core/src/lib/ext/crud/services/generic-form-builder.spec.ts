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

  describe('run', () => {
    it('should skip loading data and create toolbar for add page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);

      service.run();

      expect(consumer.store.loadGet).not.toHaveBeenCalled();
      expect(consumer.toolbar.tools.length).toBeGreaterThan(0);
    });

    it('should load data and register effects for non-add page type', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      TestBed.runInInjectionContext(() => service.run());

      expect(consumer.store.loadGet).toHaveBeenCalledWith('123', undefined);
      expect(consumer.toolbar.tools.length).toBeGreaterThan(0);
    });

    it('should not create toolbar when disabled', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);

      service.run(false);

      expect(consumer.toolbar.tools.length).toBe(0);
    });
  });

  describe('loadData', () => {
    it('should reset navigation state after save redirect', () => {
      const consumer = createMockConsumer();
      consumer.navigationState = { saved: true };
      service.init(consumer as any);

      service.loadData();

      expect(consumer.store.loadGet).not.toHaveBeenCalled();
      expect(window.history.state['saved']).toBe(false);
    });
  });

  describe('add', () => {
    it('should call loadAdd without id', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.add();

      expect(consumer.store.loadAdd).toHaveBeenCalledWith(expect.objectContaining({ name: '' }), undefined);
    });
  });

  describe('update', () => {
    it('should call loadUpdate with current id', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.update();

      expect(consumer.store.loadUpdate).toHaveBeenCalledWith('123', expect.anything(), undefined);
    });
  });

  describe('delete', () => {
    it('should call loadDelete with current id', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.delete();

      expect(consumer.store.loadDelete).toHaveBeenCalledWith('123', undefined);
    });
  });

  describe('save', () => {
    it('should route to add for add page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);

      service.save();

      expect(consumer.store.loadAdd).toHaveBeenCalled();
    });

    it('should route to update for edit page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('edit');
      service.init(consumer as any);

      service.save();

      expect(consumer.store.loadUpdate).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should prevent default and save', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('edit');
      service.init(consumer as any);
      const event = { preventDefault: vi.fn() } as unknown as Event;

      consumer.onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(consumer.store.loadUpdate).toHaveBeenCalled();
    });
  });

  describe('handleSaveEvents', () => {
    it('should set save tool loading flag while saving', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      const tool = { showLoading: signal(false) };
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.add.set({ status: 'inProgress' as any, response: { data: {} }, tool });
      TestBed.tick();
      expect(tool.showLoading()).toBe(true);

      consumer.store.add.set({
        status: 'success' as any,
        response: { data: { id: '1', title: 'done' } },
        tool,
      });
      TestBed.tick();
      expect(tool.showLoading()).toBe(false);
    });

    it('should mutate get state and navigate to view page on success', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.add.set({
        status: 'success' as any,
        response: { data: { id: '99', title: 'saved' } },
        tool: null,
      });
      TestBed.tick();

      expect(consumer.store.mutateGet).toHaveBeenCalledWith({ id: '99', title: 'saved' });
      expect(router.navigate).toHaveBeenCalledWith(
        ['/view/99'],
        expect.objectContaining({ state: expect.objectContaining({ saved: true }) }),
      );
    });

    it('should not navigate on success when embedded', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('add');
      consumer.isEmbedded.set(true);
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.add.set({
        status: 'success' as any,
        response: { data: { id: '99', title: 'saved' } },
        tool: null,
      });
      TestBed.tick();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('handleLoadDataEvents', () => {
    it('should hydrate data and patch form on successful fetch', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.get.set({
        status: 'success' as any,
        response: { data: { id: '42', title: 'new title' } },
        tool: null,
      });
      TestBed.tick();

      expect(consumer.data()).toEqual({ id: '42', title: 'new title' });
      expect(consumer.id()).toBe('42');
      expect(consumer.title()).toBe('new title');
      expect(consumer.formModel()).toStrictEqual(expect.objectContaining({ title: 'new title' }));
    });
  });

  describe('handleDeleteEvents', () => {
    it('should navigate back to list page after delete', () => {
      const consumer = createMockConsumer();
      consumer.isEmbedded.set(false);
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.delete.set({ status: 'success' as any, response: { data: '' }, tool: null });
      TestBed.tick();

      expect(consumer.store.resetDelete).toHaveBeenCalledWith();
      expect(router.navigate).toHaveBeenCalledWith(['/list']);
    });

    it('should not navigate on success when embedded', () => {
      const consumer = createMockConsumer();
      consumer.isEmbedded.set(true);
      service.init(consumer as any);
      TestBed.runInInjectionContext(() => service.run(false));

      consumer.store.delete.set({ status: 'success' as any, response: { data: '' }, tool: null });
      TestBed.tick();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('createToolbar events', () => {
    it('should load data on refresh tool event', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);
      const toolbar = TestBed.runInInjectionContext(() => service.createToolbar(true));
      const refresh = toolbar!.tools.find((tool: any) => tool.type === 'refresh')!;

      refresh.command();

      expect(consumer.store.loadGet).toHaveBeenCalledWith('123', expect.objectContaining({ type: 'refresh' }));
    });

    it('should delete on delete tool event for view page type', () => {
      const consumer = createMockConsumer();
      consumer.pageType.set('view');
      service.init(consumer as any);
      const toolbar = TestBed.runInInjectionContext(() => service.createToolbar(true));
      const deleteTool = toolbar!.tools.find((tool: any) => tool.type === 'delete')!;

      deleteTool.command();

      expect(consumer.store.loadDelete).toHaveBeenCalledWith('123', expect.anything());
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
    inputId: signal('123'),
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
      get: signal({ status: 'initial' as any, response: { data: {} }, tool: null as any }),
      add: signal({ status: 'initial' as any, response: { data: {} }, tool: null as any }),
      update: signal({ status: 'initial' as any, response: { data: {} }, tool: null as any }),
      delete: signal({ status: 'initial' as any, response: { data: '' }, tool: null as any }),
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
