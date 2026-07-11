import type { InputSignal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import type {
  AddState,
  DeleteState,
  GetState,
  ListState,
  UpdateState,
} from '../../store/models/signal-store.model';
import type { PageType } from '../enums/page.enum';
import type { CrudConfig } from './crud-config.model';
import type { Pagination } from './pagination.model';
import type { NuTable } from './table.model';
import type { NuTool, NuToolbar } from './toolbar.model';

// eslint-disable-next-line
type GenericTypedForm = any;
// eslint-disable-next-line
type GenericRequest = any;
// eslint-disable-next-line
type GenericResponse = any;

export interface CrudStore {
  // State signals
  list(): ListState<RestListQuery, GenericResponse>;
  get(): GetState<GenericResponse>;
  add(): AddState<GenericRequest, GenericResponse>;
  update(): UpdateState<GenericRequest, GenericResponse>;
  delete(): DeleteState;

  // Computed signals
  listStatus(): OperationStatus;
  listResponse(): RestListResponse<GenericResponse>;
  getStatus(): OperationStatus;
  getResponse(): RestGetResponse<GenericResponse>;
  addStatus(): OperationStatus;
  addResponse(): RestAddResponse<GenericResponse>;
  updateStatus(): OperationStatus;
  updateResponse(): RestUpdateResponse<GenericResponse>;
  deleteStatus(): OperationStatus;
  deleteResponse(): RestDeleteResponse;

  // Methods
  loadList(query: RestListQuery, tool?: NuTool): void;
  loadGet(query: string, tool?: NuTool): void;
  loadAdd(request: GenericRequest, tool?: NuTool): void;
  loadUpdate(query: string, request: GenericRequest, tool?: NuTool): void;
  loadDelete(query: string, tool?: NuTool): void;
  getMutate(response: GenericResponse): void;
  resetList(): void;
  resetGet(): void;
  resetAdd(): void;
  resetUpdate(): void;
  resetDelete(): void;
  resetAll(): void;
}

import type { OperationStatus } from '@nucleus/common';
import type {
  RestAddResponse,
  RestDeleteResponse,
  RestGetResponse,
  RestListQuery,
  RestListResponse,
  RestUpdateResponse,
} from './rest.model';

export interface GenericEntity<
  Full = unknown,
  List = Full[],
  Add = unknown,
  Update = unknown,
  Form = unknown,
  TypedFrom = GenericTypedForm,
  Config = CrudConfig<any, any, any, any>,
> {
  full: Full;
  list: List;
  add: Add;
  update: Update;
  form: Form;
  typedForm: TypedFrom;
  store: CrudStore;
  config: Config;
}

export interface GenericListConsumer<T extends GenericEntity> {
  store: CrudStore;
  config: Readonly<T['config']>;
  isEmbedded: InputSignal<boolean>;
  toolbar: NuToolbar;
  table: NuTable;
  data: WritableSignal<T['list']>;
  isDataLoading: WritableSignal<boolean>;
  pagination: WritableSignal<Pagination>;
  selectedRecords: WritableSignal<T['list']>;
  changeSelection: (selectedItems: T['list'] | T['list'][0]) => void;
}

export interface GenericFormConsumer<T extends GenericEntity> {
  store: CrudStore;
  id: InputSignal<string>;
  config: Readonly<T['config']>;
  isEmbedded: InputSignal<boolean>;
  toolbar: NuToolbar;
  pageType: InputSignal<PageType>;
  form: FormGroup<T['typedForm']>;
  navigationState?: Record<string, unknown>;
  data: WritableSignal<T['full']>;
  title: WritableSignal<string>;
  isSubmitting: WritableSignal<boolean>;
  isSubmitted: WritableSignal<boolean>;
  save: () => void;
  formControlHasError: (controlName: string, error: string) => boolean | undefined;
}
