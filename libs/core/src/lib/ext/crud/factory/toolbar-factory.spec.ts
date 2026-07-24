import { signal } from '@angular/core';
import { ToolType } from '../enums/toolbar.enum';
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
      expect(toolbar.tools[0].type).toBe(ToolType.Save);
      expect(toolbar.tools[1].type).toBe(ToolType.Cancel);
    });

    it('should have events observable', () => {
      const toolbar = createAddToolbar(mockConfig as any);
      expect(toolbar.events$).toBeDefined();
    });

    it('should merge tool overrides', () => {
      const toolbar = createAddToolbar(mockConfig as any, {
        [ToolType.Save]: { label: 'Custom Save' },
      });

      expect(toolbar.tools[0].label).toBe('Custom Save');
    });
  });

  describe('createEditToolbar', () => {
    it('should create toolbar with save and cancel tools', () => {
      const toolbar = createEditToolbar(mockConfig as any, {
        [ToolType.Cancel]: { id: signal('123'), routerStates: signal({}) },
      });

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe(ToolType.Save);
      expect(toolbar.tools[1].type).toBe(ToolType.Cancel);
    });
  });

  describe('createViewToolbar', () => {
    it('should create toolbar with edit, delete, refresh, and back tools', () => {
      const toolbar = createViewToolbar(mockConfig as any, {
        [ToolType.Edit]: { id: signal('123'), routerStates: signal({}) },
      });

      expect(toolbar.tools).toHaveLength(4);
      expect(toolbar.tools[0].type).toBe(ToolType.Edit);
      expect(toolbar.tools[1].type).toBe(ToolType.Delete);
      expect(toolbar.tools[2].type).toBe(ToolType.Refresh);
      expect(toolbar.tools[3].type).toBe(ToolType.Back);
    });
  });

  describe('createListToolbar', () => {
    it('should create toolbar with add and refresh tools', () => {
      const toolbar = createListToolbar(mockConfig as any);

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe(ToolType.Add);
      expect(toolbar.tools[1].type).toBe(ToolType.Refresh);
    });
  });

  describe('createTableToolbar', () => {
    it('should create toolbar with view and delete tools', () => {
      const toolbar = createTableToolbar(mockConfig as any);

      expect(toolbar.tools).toHaveLength(2);
      expect(toolbar.tools[0].type).toBe(ToolType.View);
      expect(toolbar.tools[1].type).toBe(ToolType.Delete);
    });
  });
});
