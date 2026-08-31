import { createActionPermissions } from './permission-factory';

describe('PermissionFactory', () => {
  describe('createActionPermissions', () => {
    it('should create permissions for a simple path', () => {
      const permissions = createActionPermissions(['users']);

      expect(permissions).toEqual({
        list: 'users.list',
        view: 'users.view',
        add: 'users.add',
        edit: 'users.edit',
        delete: 'users.delete',
      });
    });

    it('should create permissions for nested path', () => {
      const permissions = createActionPermissions(['admin', 'users']);

      expect(permissions).toEqual({
        list: 'admin.users.list',
        view: 'admin.users.view',
        add: 'admin.users.add',
        edit: 'admin.users.edit',
        delete: 'admin.users.delete',
      });
    });

    it('should create permissions for empty path', () => {
      const permissions = createActionPermissions([]);

      expect(permissions).toEqual({
        list: 'list',
        view: 'view',
        add: 'add',
        edit: 'edit',
        delete: 'delete',
      });
    });

    it('should include all ToolType action keys', () => {
      const permissions = createActionPermissions(['test']);

      expect(permissions).toHaveProperty('list');
      expect(permissions).toHaveProperty('view');
      expect(permissions).toHaveProperty('add');
      expect(permissions).toHaveProperty('edit');
      expect(permissions).toHaveProperty('delete');
    });
  });
});
