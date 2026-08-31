import { signal } from '@angular/core';
import { vi } from 'vitest';
import {
  createAddToolbar,
  createEditToolbar,
  createListToolbar,
  createTableToolbar,
  createViewToolbar,
} from './toolbar-factory';

const buildConfig = () => ({
  path: {
    page: {
      list: vi.fn(() => ['/list']),
      add: vi.fn(() => ['/add']),
      view: vi.fn((id: string) => ['/view', id]),
      edit: vi.fn((id: string) => ['/edit', id]),
    },
  },
  field: { id: 'id', title: 'title' },
  permission: {
    action: { add: 'add', edit: 'edit', view: 'view', delete: 'delete', list: 'list' },
  },
});

const mockConfig = {
  path: {
    page: {
      list: () => ['/list'],
      add: () => ['/add'],
      view: (id: string) => ['/view', id],
      edit: (id: string) => ['/edit', id],
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
};

describe('ToolbarFactory', () => {
  describe('createAddToolbar', () => {
    it('should create toolbar with save and cancel tools', () => {
      const toolbar = createAddToolbar(mockConfig as any);

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe('save');
      expect(toolbar.tools[1].type).toBe('cancel');
    });

    it('should have events observable', () => {
      const toolbar = createAddToolbar(mockConfig as any);
      expect(toolbar.events$).toBeDefined();
    });

    it('should merge tool overrides', () => {
      const toolbar = createAddToolbar(mockConfig as any, {
        save: { label: 'Custom Save' },
      });

      expect(toolbar.tools[0].label).toBe('Custom Save');
    });
  });

  describe('createEditToolbar', () => {
    it('should create toolbar with save and cancel tools', () => {
      const toolbar = createEditToolbar(mockConfig as any, {
        cancel: { id: signal('123'), routerStates: signal({}) },
      });

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe('save');
      expect(toolbar.tools[1].type).toBe('cancel');
    });
  });

  describe('createViewToolbar', () => {
    it('should create toolbar with edit, delete, refresh, and back tools', () => {
      const toolbar = createViewToolbar(mockConfig as any, {
        edit: { id: signal('123'), routerStates: signal({}) },
      });

      expect(toolbar.tools).toHaveLength(4);
      expect(toolbar.tools[0].type).toBe('edit');
      expect(toolbar.tools[1].type).toBe('delete');
      expect(toolbar.tools[2].type).toBe('refresh');
      expect(toolbar.tools[3].type).toBe('back');
    });
  });

  describe('createListToolbar', () => {
    it('should create toolbar with add and refresh tools', () => {
      const toolbar = createListToolbar(mockConfig as any);

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe('add');
      expect(toolbar.tools[1].type).toBe('refresh');
    });
  });

  describe('createTableToolbar', () => {
    it('should create toolbar with view and delete tools', () => {
      const toolbar = createTableToolbar(mockConfig as any);

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe('view');
      expect(toolbar.tools[1].type).toBe('delete');
    });
  });

  describe('tool commands', () => {
    it('add toolbar save should emit on events$ and cancel should navigate to list', () => {
      const config = buildConfig();
      const toolbar = createAddToolbar(config as any);
      const emissions: unknown[] = [];
      toolbar.events$.subscribe((event) => emissions.push(event));

      toolbar.tools[0].command();
      expect(emissions).toEqual([{ tool: toolbar.tools[0] }]);

      toolbar.tools[1].command();
      expect(config.path.page.list).toHaveBeenCalledTimes(1);
    });

    it('add toolbar tools should carry add and list permissions', () => {
      const toolbar = createAddToolbar(buildConfig() as any);
      expect(toolbar.tools[0].permission).toBe('add');
      expect(toolbar.tools[1].permission).toBe('list');
    });

    it('edit toolbar save should emit on events$ and cancel should navigate to view of current id', () => {
      const config = buildConfig();
      const toolbar = createEditToolbar(config as any, {
        cancel: { id: signal('123'), routerStates: signal({}) },
      });
      const emissions: unknown[] = [];
      toolbar.events$.subscribe((event) => emissions.push(event));

      toolbar.tools[0].command();
      expect(emissions).toEqual([{ tool: toolbar.tools[0] }]);

      toolbar.tools[1].command();
      expect(config.path.page.view).toHaveBeenCalledWith('123');
    });

    it('view toolbar edit and back should navigate, delete and refresh should emit', () => {
      const config = buildConfig();
      const toolbar = createViewToolbar(config as any, {
        edit: { id: signal('456'), routerStates: signal({}) },
      });
      const [editTool, deleteTool, refreshTool, backTool] = toolbar.tools;
      const emissions: unknown[] = [];
      toolbar.events$.subscribe((event) => emissions.push(event));

      editTool.command();
      expect(config.path.page.edit).toHaveBeenCalledWith('456');

      deleteTool.command();
      expect(emissions[0]).toEqual({ tool: deleteTool });

      refreshTool.command();
      expect(emissions[1]).toEqual({ tool: refreshTool });

      backTool.command();
      expect(config.path.page.list).toHaveBeenCalledTimes(1);
    });

    it('list toolbar add should navigate to add and refresh should emit', () => {
      const config = buildConfig();
      const toolbar = createListToolbar(config as any);
      const emissions: unknown[] = [];
      toolbar.events$.subscribe((event) => emissions.push(event));

      toolbar.tools[0].command();
      expect(config.path.page.add).toHaveBeenCalledTimes(1);

      toolbar.tools[1].command();
      expect(emissions).toEqual([{ tool: toolbar.tools[1] }]);
    });

    it('table toolbar view should navigate to row view and delete should emit with row id payload', () => {
      const config = buildConfig();
      const toolbar = createTableToolbar(config as any);
      const [viewAction, deleteAction] = toolbar.tools;
      const row = { id: '789', title: 'Row Title' };
      const emissions: unknown[] = [];
      toolbar.events$.subscribe((event) => emissions.push(event));

      viewAction.command(row);
      expect(config.path.page.view).toHaveBeenCalledWith('789');

      deleteAction.command(row);
      expect(emissions).toEqual([{ tool: deleteAction, payload: '789' }]);
    });

    it('table toolbar should expose permissions and router states derived from the row', () => {
      const toolbar = createTableToolbar(buildConfig() as any);
      const [viewAction, deleteAction] = toolbar.tools;

      expect(viewAction.permission).toBe('view');
      expect(deleteAction.permission).toBe('delete');
      expect(viewAction.getRouterStates?.({ id: '1', title: 'Hello' })).toEqual({
        title: 'Hello',
      });
    });
  });
});
