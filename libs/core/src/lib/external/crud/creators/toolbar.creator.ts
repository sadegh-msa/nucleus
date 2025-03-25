import { signal } from '@angular/core';
import { mergeObjects } from '@nucleus/common';
import { Observable, Subject } from 'rxjs';
import { RouterStateKey } from '../enums/router-state.enum';
import { ToolElement, ToolType } from '../enums/toolbar.enum';
import { GenericEntity } from '../models/generic.model';
import { NuTool, NuToolbar, NuToolEvent } from '../models/toolbar.model';

type AddTools = Partial<Record<ToolType.Save | ToolType.Cancel, Partial<NuTool>>>;
type ViewEditRequired = Required<Pick<Partial<NuTool>, 'id' | 'routerStates'>>;
type EditTools = Partial<Record<ToolType.Save, Partial<NuTool>>> &
  Record<ToolType.Cancel, ViewEditRequired>;
type ViewTools = Partial<
  Record<ToolType.Delete | ToolType.Refresh | ToolType.Back, Partial<NuTool>>
> &
  Record<ToolType.Edit, ViewEditRequired>;
type ListTools = Partial<Record<ToolType.Add | ToolType.Refresh, Partial<NuTool>>>;
type TableTools = Partial<Record<ToolType.View | ToolType.Delete, Partial<NuTool>>>;

const commonStyleClass = ['nu-tool', 'fab', 'button', 'moderate'];
const buttonStyleClass = {
  text: {
    stamp: new Set([...commonStyleClass, 'stamp', 'text', 'second-ink']),
    danger: new Set([...commonStyleClass, 'stamp', 'text', 'second-danger']),
    primary: new Set([...commonStyleClass, 'stamp', 'text', 'second-primary']),
  },
  emphasis: {
    primary: new Set([...commonStyleClass, 'primary', 'emphasis']),
  },
  table: {
    text: {
      primary: new Set([...commonStyleClass, 'watermark', 'text', 'second-primary']),
      danger: new Set([...commonStyleClass, 'watermark', 'text', 'second-danger']),
    }
  },
};

const createIconPath = (icon: string, family = 'outline') => `icons/${family}/${icon}.svg`;
const deleteConfirmMessage = $localize`Are you sure that you want to delete this item?`;

const createSaveTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Save,
      label: $localize`Save`,
      icon: createIconPath('save-2'),
      element: ToolElement.Button,
      styleClass: buttonStyleClass.emphasis.primary,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createCancelTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Cancel,
      label: $localize`Cancel`,
      icon: createIconPath('close-square'),
      element: ToolElement.Link,
      styleClass: buttonStyleClass.text.stamp,
      ...toOverride,
    },
    toMerge,
  );

const createAddTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Add,
      label: $localize`Add`,
      icon: createIconPath('add-square'),
      element: ToolElement.Link,
      styleClass: buttonStyleClass.text.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createEditTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Edit,
      label: $localize`Edit`,
      icon: createIconPath('edit'),
      element: ToolElement.Link,
      styleClass: buttonStyleClass.text.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Delete,
      label: $localize`Delete`,
      icon: createIconPath('trash'),
      element: ToolElement.Button,
      confirm: deleteConfirmMessage,
      styleClass: buttonStyleClass.text.danger,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createRefreshTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Refresh,
      label: $localize`Refresh`,
      icon: createIconPath('refresh-square-2'),
      element: ToolElement.Button,
      styleClass: buttonStyleClass.text.stamp,
      key: self.crypto.randomUUID(),
      showLoading: signal(false),
      ...toOverride,
    },
    toMerge,
  );

const createBackTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Back,
      label: $localize`Back to List`,
      icon: createIconPath('arrow-up-3'),
      element: ToolElement.Link,
      styleClass: buttonStyleClass.text.stamp,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableViewTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.View,
      tooltip: $localize`View`,
      icon: createIconPath('book', 'bulk'),
      element: ToolElement.Link,
      styleClass: buttonStyleClass.table.text.primary,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

const createTableDeleteTool = (toOverride = {}, toMerge = {}) =>
  mergeObjects(
    {
      type: ToolType.Delete,
      tooltip: $localize`Delete`,
      icon: createIconPath('trash', 'bulk'),
      element: ToolElement.Button,
      confirm: deleteConfirmMessage,
      styleClass: buttonStyleClass.table.text.danger,
      key: self.crypto.randomUUID(),
      ...toOverride,
    },
    toMerge,
  );

export class ToolbarCreator {
  static createAddTools<T extends GenericEntity>(config: T['config'], tools?: AddTools): NuToolbar {
    const subject$ = new Subject<NuToolEvent>();
    const saveTool = createSaveTool(
      {
        command: () => subject$.next({ tool: saveTool }),
        permission: config.permission.action.add,
        icon: createIconPath('save-add'),
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

  static createEditTools<T extends GenericEntity>(
    config: T['config'],
    tools: EditTools,
  ): NuToolbar {
    const subject$ = new Subject<NuToolEvent>();
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

  static createViewTools<T extends GenericEntity>(
    config: T['config'],
    tools: ViewTools,
  ): NuToolbar {
    const subject$ = new Subject<NuToolEvent>();
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

  static createListTools<T extends GenericEntity>(
    config: T['config'],
    tools?: ListTools,
  ): NuToolbar {
    const subject$ = new Subject<NuToolEvent>();
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

  static createTableTools<T extends GenericEntity>(
    config: T['config'],
    tools?: TableTools,
  ): { tools: NuTool[]; events$: Observable<NuToolEvent> } {
    type Row = T['list'][0];

    const subject$ = new Subject<NuToolEvent>();
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
}
