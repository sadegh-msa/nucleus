import { signal } from '@angular/core';
import { mergeAll } from '@nucleus/common';
import { type Observable, Subject } from 'rxjs';
import { RouterStateKey } from '../enums/router-state.enum';
import { ToolElement, ToolType } from '../enums/toolbar.enum';
import type { GenericEntityModel } from '../models/generic.model';
import type { ToolbarModel, ToolEventModel, ToolModel } from '../models/toolbar.model';

type AddTools = Partial<Record<ToolType.Save | ToolType.Cancel, Partial<ToolModel>>>;
type ViewEditRequired = Required<Pick<ToolModel, 'id' | 'routerStates'>>;
type EditTools = Partial<Record<ToolType.Save, Partial<ToolModel>>> &
  Record<ToolType.Cancel, ViewEditRequired>;
type ViewTools = Partial<
  Record<ToolType.Delete | ToolType.Refresh | ToolType.Back, Partial<ToolModel>>
> &
  Record<ToolType.Edit, ViewEditRequired>;
type ListTools = Partial<Record<ToolType.Add | ToolType.Refresh, Partial<ToolModel>>>;
type TableTools = Partial<Record<ToolType.View | ToolType.Delete, Partial<ToolModel>>>;

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
      type: ToolType.Save,
      label: $localize`Save`,
      icon: 'save-2',
      element: ToolElement.Button,
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
      type: ToolType.Cancel,
      label: $localize`Cancel`,
      icon: 'close-square',
      element: ToolElement.Link,
      ngClass: buttonStyleClass.basic.stamp,
      ...toOverride,
    },
    toMerge,
  );

const createAddTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: ToolType.Add,
      label: $localize`Add`,
      icon: 'add-square',
      element: ToolElement.Link,
      ngClass: buttonStyleClass.basic.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createEditTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: ToolType.Edit,
      label: $localize`Edit`,
      icon: 'edit',
      element: ToolElement.Link,
      ngClass: buttonStyleClass.basic.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: ToolType.Delete,
      label: $localize`Delete`,
      icon: 'trash',
      element: ToolElement.Button,
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
      type: ToolType.Refresh,
      label: $localize`Refresh`,
      icon: 'refresh-square-2',
      element: ToolElement.Button,
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
      type: ToolType.Back,
      label: $localize`Back to List`,
      icon: 'arrow-up-3',
      element: ToolElement.Link,
      ngClass: buttonStyleClass.basic.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableViewTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: ToolType.View,
      tooltip: $localize`View`,
      icon: 'book',
      iconVariant: 'bulk',
      element: ToolElement.Link,
      ngClass: buttonStyleClass.table.basic.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeAll(
    {
      type: ToolType.Delete,
      tooltip: $localize`Delete`,
      icon: 'trash',
      iconVariant: 'bulk',
      element: ToolElement.Button,
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
    tools?.[ToolType.Save],
  );
  const cancelTool = createCancelTool(
    {
      command: () => config.path.page.list(),
      permission: config.permission.action.list,
    },
    tools?.[ToolType.Cancel],
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
    tools?.[ToolType.Save],
  );
  const cancelTool = createCancelTool(
    {
      command: () => config.path.page.view(cancelTool.id()),
      permission: config.permission.action.view,
    },
    tools?.[ToolType.Cancel],
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
    tools[ToolType.Edit],
  );
  const deleteTool = createDeleteTool(
    {
      command: () => subject$.next({ tool: deleteTool }),
      permission: config.permission.action.delete,
    },
    tools[ToolType.Delete],
  );
  const refreshTool = createRefreshTool(
    {
      command: () => subject$.next({ tool: refreshTool }),
      permission: config.permission.action.view,
    },
    tools[ToolType.Refresh],
  );
  const backTool = createBackTool(
    {
      command: () => config.path.page.list(),
      permission: config.permission.action.list,
    },
    tools[ToolType.Back],
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
    tools?.[ToolType.Add],
  );
  const refreshTool = createRefreshTool(
    {
      command: () => subject$.next({ tool: refreshTool }),
      permission: config.permission.action.list,
    },
    tools?.[ToolType.Refresh],
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
      getRouterStates: (row: Row) => {
        return { [RouterStateKey.Title]: row[config.field.title as keyof Row] };
      },
      permission: config.permission.action.view,
    },
    tools?.[ToolType.View],
  );
  const deleteAction = createTableDeleteTool(
    {
      command: (row: Row) => subject$.next({ tool: deleteAction, payload: getId(row) }),
      permission: config.permission.action.delete,
    },
    tools?.[ToolType.Delete],
  );

  return {
    events$: subject$.asObservable(),
    tools: [viewAction, deleteAction],
  };
}
