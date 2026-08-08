import { signal } from '@angular/core';
import {
  createAddToolbar,
  createEditToolbar,
  createListToolbar,
  createTableToolbar,
  createViewToolbar,
} from './toolbar-factory';

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
        ['save']: { label: 'Custom Save' },
      });

      expect(toolbar.tools[0].label).toBe('Custom Save');
    });
  });

  describe('createEditToolbar', () => {
    it('should create toolbar with save and cancel tools', () => {
      const toolbar = createEditToolbar(mockConfig as any, {
        ['cancel']: { id: signal('123'), routerStates: signal({}) },
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
});
