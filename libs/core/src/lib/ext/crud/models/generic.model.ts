import type { InputSignal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import {
  createAddStoreActionGroup,
  createDeleteStoreActionGroup,
  createGetStoreActionGroup,
  createListStoreActionGroup,
  createUpdateStoreActionGroup,
} from '../../store/creators/store-action.creator'; // Possibility of circular dependency
import type {
  createAddStoreSelector,
  createDeleteStoreSelector,
  createGetStoreSelector,
  createListStoreSelector,
  createUpdateStoreSelector,
} from '../../store/creators/store-selector.creator'; // Possibility of circular dependency
import type {
  AddState,
  DeleteState,
  GetState,
  ListState,
  UpdateState,
} from '../../store/models/state.model'; // Possibility of circular dependency
import type { PageType } from '../enums/page.enum';
import type { CrudConfig } from './crud-config.model';
import type { Pagination } from './pagination.model';
import type { RestListQuery } from './rest.model';
import type { NuTable } from './table.model';
import type { NuToolbar } from './toolbar.model';

// eslint-disable-next-line
type GenericTypedForm = any;
// eslint-disable-next-line
type GenericRequest = any;
// eslint-disable-next-line
type GenericResponse = any;
// eslint-disable-next-line
type GenericMainState = any;
type GenericListState = ListState<RestListQuery, GenericResponse>;
type GenericGetState = GetState<GenericResponse>;
type GenericAddState = AddState<GenericRequest, GenericResponse>;
type GenericUpdateState = UpdateState<GenericRequest, GenericResponse>;
type GenericDeleteState = DeleteState;

const genericActions = {
  ...createListStoreActionGroup<RestListQuery, GenericResponse>(''),
  ...createGetStoreActionGroup<GenericResponse>(''),
  ...createAddStoreActionGroup<GenericRequest, GenericResponse>(''),
  ...createUpdateStoreActionGroup<GenericRequest, GenericResponse>(''),
  ...createDeleteStoreActionGroup(''),
};

export interface GenericEntity<
  Full = unknown,
  List = Full[],
  Add = unknown,
  Update = unknown,
  Form = unknown,
  TypedFrom = GenericTypedForm,
  States = unknown,
  Config = CrudConfig<any, any, any, any>,
> {
  full: Full;
  list: List;
  add: Add;
  update: Update;
  form: Form;
  typedForm: TypedFrom;
  store: {
    states: States;
    actions: typeof genericActions;
    selectors: {
      list: ReturnType<typeof createListStoreSelector<GenericMainState, GenericListState>>['list'];
      get: ReturnType<typeof createGetStoreSelector<GenericMainState, GenericGetState>>['get'];
      add: ReturnType<typeof createAddStoreSelector<GenericMainState, GenericAddState>>['add'];
      update: ReturnType<
        typeof createUpdateStoreSelector<GenericMainState, GenericUpdateState>
      >['update'];
      delete: ReturnType<
        typeof createDeleteStoreSelector<GenericMainState, GenericDeleteState>
      >['delete'];
    };
  };
  config: Config;
}

export interface GenericListConsumer<T extends GenericEntity> {
  store: Pick<T['store'], 'actions' | 'selectors'>;
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
  store: Pick<T['store'], 'actions' | 'selectors'>;
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
