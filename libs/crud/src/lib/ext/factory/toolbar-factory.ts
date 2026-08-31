import { signal } from '@angular/core';
import { mergeAll } from '@nucleus/common';
import { type Observable, Subject } from 'rxjs';
import type { GenericEntityModel } from '../models/generic.model';
import type { ToolbarModel, ToolEventModel, ToolModel } from '../models/toolbar.model';

type AddTools = Partial<Record<'save' | 'cancel', Partial<ToolModel>>>;
type ViewEditRequired = Required<Pick<ToolModel, 'id' | 'routerStates'>>;
type EditTools = Partial<Record<'save', Partial<ToolModel>>> & Record<'cancel', ViewEditRequired>;
type ViewTools = Partial<Record<'delete' | 'refresh' | 'back', Partial<ToolModel>>> &
  Record<'edit', ViewEditRequired>;
type ListTools = Partial<Record<'add' | 'refresh', Partial<ToolModel>>>;
type TableTools = Partial<Record<'view' | 'delete', Partial<ToolModel>>>;

const commonStyleClass = ['nu-tool', 'ui', 'button', 'medium'];
const buttonStyleClass = {
  basic: {
    stamp: new Set([...commonStyleClass, 'stamp', 'basic', 'second-ink']),
    danger: new Set([...commonStyleClass, 'stamp', 'basic', 'second-danger']),
    primary: new Set([...commonStyleClass, 'stamp', 'basic', 'second-primary']),
  },
  emphasis: {
    primary: new Set([...commonStyleClass, 'primary', 'emphasis']),
  },
  table: {
    basic: {
      primary: new Set([...commonStyleClass, 'watermark', 'basic', 'second-primary']),
      danger: new Set([...commonStyleClass, 'watermark', 'basic', 'second-danger']),
    },
  },
};

const deleteConfirmMessage = $localize`Are you sure that you want to delete this item?`;

const createSaveTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'save',
      label: $localize`Save`,
      icon: 'save-2',
      element: 'button',
      ngClass: buttonStyleClass.emphasis.primary,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createCancelTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'cancel',
      label: $localize`Cancel`,
      icon: 'close-square',
      element: 'link',
      ngClass: buttonStyleClass.basic.stamp,
      ...toOverride,
    },
    toMerge,
  );

const createAddTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'add',
      label: $localize`Add`,
      icon: 'add-square',
      element: 'link',
      ngClass: buttonStyleClass.basic.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createEditTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'edit',
      label: $localize`Edit`,
      icon: 'edit',
      element: 'link',
      ngClass: buttonStyleClass.basic.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'delete',
      label: $localize`Delete`,
      icon: 'trash',
      element: 'button',
      confirm: deleteConfirmMessage,
      ngClass: buttonStyleClass.basic.danger,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createRefreshTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'refresh',
      label: $localize`Refresh`,
      icon: 'refresh-square-2',
      element: 'button',
      ngClass: buttonStyleClass.basic.stamp,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createBackTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'back',
      label: $localize`Back to List`,
      icon: 'arrow-up-3',
      element: 'link',
      ngClass: buttonStyleClass.basic.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableViewTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'view',
      tooltip: $localize`View`,
      icon: 'book',
      iconVariant: 'bulk',
      element: 'link',
      ngClass: buttonStyleClass.table.basic.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: 'delete',
      tooltip: $localize`Delete`,
      icon: 'trash',
      iconVariant: 'bulk',
      element: 'button',
      confirm: deleteConfirmMessage,
      ngClass: buttonStyleClass.table.basic.danger,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

export function createAddToolbar<T extends GenericEntityModel>(
  config: T['config'],
  tools?: AddTools,
): ToolbarModel {
  const subject$ = new Subject<ToolEventModel>();
  const saveTool = createSaveTool(
    {
      command: () => subject$.next({ tool: saveTool }),
      permission: config.permission.action.add,
      icon: 'save-add',
    },
    tools?.['save'],
  );
  const cancelTool = createCancelTool(
    {
      command: () => config.path.page.list(),
      permission: config.permission.action.list,
    },
    tools?.['cancel'],
  );

  return {
    events$: subject$.asObservable(),
    tools: [saveTool, cancelTool],
  };
}

export function createEditToolbar<T extends GenericEntityModel>(
  config: T['config'],
  tools: EditTools,
): ToolbarModel {
  const subject$ = new Subject<ToolEventModel>();
  const saveTool = createSaveTool(
    {
      command: () => subject$.next({ tool: saveTool }),
      permission: config.permission.action.edit,
    },
    tools?.['save'],
  );
  const cancelTool = createCancelTool(
    {
      command: () => config.path.page.view(cancelTool.id()),
      permission: config.permission.action.view,
    },
    tools?.['cancel'],
  );

  return {
    events$: subject$.asObservable(),
    tools: [saveTool, cancelTool],
  };
}

export function createViewToolbar<T extends GenericEntityModel>(
  config: T['config'],
  tools: ViewTools,
): ToolbarModel {
  const subject$ = new Subject<ToolEventModel>();
  const editTool = createEditTool(
    {
      command: () => config.path.page.edit(editTool.id()),
      permission: config.permission.action.edit,
    },
    tools['edit'],
  );
  const deleteTool = createDeleteTool(
    {
      command: () => subject$.next({ tool: deleteTool }),
      permission: config.permission.action.delete,
    },
    tools['delete'],
  );
  const refreshTool = createRefreshTool(
    {
      command: () => subject$.next({ tool: refreshTool }),
      permission: config.permission.action.view,
    },
    tools['refresh'],
  );
  const backTool = createBackTool(
    {
      command: () => config.path.page.list(),
      permission: config.permission.action.list,
    },
    tools['back'],
  );

  return {
    events$: subject$.asObservable(),
    tools: [editTool, deleteTool, refreshTool, backTool],
  };
}

export function createListToolbar<T extends GenericEntityModel>(
  config: T['config'],
  tools?: ListTools,
): ToolbarModel {
  const subject$ = new Subject<ToolEventModel>();
  const addTool = createAddTool(
    {
      command: () => config.path.page.add(),
      permission: config.permission.action.add,
    },
    tools?.['add'],
  );
  const refreshTool = createRefreshTool(
    {
      command: () => subject$.next({ tool: refreshTool }),
      permission: config.permission.action.list,
    },
    tools?.['refresh'],
  );

  return {
    events$: subject$.asObservable(),
    tools: [addTool, refreshTool],
  };
}

export function createTableToolbar<T extends GenericEntityModel>(
  config: T['config'],
  tools?: TableTools,
): { tools: ToolModel[]; events$: Observable<ToolEventModel> } {
  type Row = T['list'][0];

  const subject$ = new Subject<ToolEventModel>();
  const getId = (row: Row) => row[config.field.id as keyof Row] as string;
  const viewAction = createTableViewTool(
    {
      command: (row: Row) => config.path.page.view(getId(row)),
      getRouterStates: (row: Row) => ({
        title: row[config.field.title as keyof Row],
      }),
      permission: config.permission.action.view,
    },
    tools?.['view'],
  );
  const deleteAction = createTableDeleteTool(
    {
      command: (row: Row) => subject$.next({ tool: deleteAction, payload: getId(row) }),
      permission: config.permission.action.delete,
    },
    tools?.['delete'],
  );

  return {
    events$: subject$.asObservable(),
    tools: [viewAction, deleteAction],
  };
}
