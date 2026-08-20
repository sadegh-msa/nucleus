import type { InputSignal, WritableSignal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import type {
  AddStateModel,
  DeleteStateModel,
  GetStateModel,
  ListStateModel,
  UpdateStateModel,
} from '../../store/models/signal-store.model';
import type { PageType } from '../types/page.type';
import type { CrudConfigModel } from './crud-config.model';
import type { PaginationModel } from './pagination.model';
import type { TableModel } from './table.model';
import type { ToolbarModel, ToolModel } from './toolbar.model';

// eslint-disable-next-line
type GenericRequestModel = any;
// eslint-disable-next-line
type GenericResponseModel = any;

export interface CrudStoreModel {
  // State signals
  list(): ListStateModel<RestListQueryModel, GenericResponseModel>;
  get(): GetStateModel<GenericResponseModel>;
  add(): AddStateModel<GenericRequestModel, GenericResponseModel>;
  update(): UpdateStateModel<GenericRequestModel, GenericResponseModel>;
  delete(): DeleteStateModel;

  // Computed signals
  listStatus(): OperationStatusType;
  listResponse(): RestListResponseModel<GenericResponseModel>;
  getStatus(): OperationStatusType;
  getResponse(): RestGetResponseModel<GenericResponseModel>;
  addStatus(): OperationStatusType;
  addResponse(): RestAddResponseModel<GenericResponseModel>;
  updateStatus(): OperationStatusType;
  updateResponse(): RestUpdateResponseModel<GenericResponseModel>;
  deleteStatus(): OperationStatusType;
  deleteResponse(): RestDeleteResponseModel;

  // Methods
  loadList(query: RestListQueryModel, tool?: ToolModel): void;
  loadGet(query: string, tool?: ToolModel): void;
  loadAdd(request: GenericRequestModel, tool?: ToolModel): void;
  loadUpdate(query: string, request: GenericRequestModel, tool?: ToolModel): void;
  loadDelete(query: string, tool?: ToolModel): void;
  mutateGet(response: GenericResponseModel): void;
  resetList(): void;
  resetGet(): void;
  resetAdd(): void;
  resetUpdate(): void;
  resetDelete(): void;
  resetAll(): void;
}

import type { OperationStatusType } from '@nucleus/common';
import type {
  RestAddResponseModel,
  RestDeleteResponseModel,
  RestGetResponseModel,
  RestListQueryModel,
  RestListResponseModel,
  RestUpdateResponseModel,
} from './rest.model';

export interface GenericEntityModel<
  Full = unknown,
  List = Full[],
  Add = unknown,
  Update = unknown,
  Form = unknown,
  Config = CrudConfigModel<any, any, any, any>,
> {
  full: Full;
  list: List;
  add: Add;
  update: Update;
  form: Form;
  store: CrudStoreModel;
  config: Config;
}

export interface GenericListConsumerModel<T extends GenericEntityModel> {
  config: Readonly<T['config']>;
  data: WritableSignal<T['list']>;
  isBusy: WritableSignal<boolean>;
  isEmbedded: InputSignal<boolean>;
  pagination: WritableSignal<PaginationModel>;
  selectedRecords: WritableSignal<T['list']>;
  store: T['store'];
  table: TableModel;
  toolbar: ToolbarModel;
  changeSelection: (selectedItems: T['list'] | T['list'][0]) => void;
}

export interface GenericFormConsumerModel<T extends GenericEntityModel> {
  config: Readonly<T['config']>;
  data: WritableSignal<T['full']>;
  formModel: WritableSignal<T['form']>;
  id: WritableSignal<string>;
  inputId: InputSignal<string>;
  isBusy: WritableSignal<boolean>;
  isEmbedded: InputSignal<boolean>;
  navigationState?: Record<string, unknown>;
  pageType: InputSignal<PageType>;
  store: T['store'];
  title: WritableSignal<string>;
  toolbar: ToolbarModel;
  form: FieldTree<T['form'], string | number, 'writable'>;
  onSubmit: (event: Event) => void;
}
