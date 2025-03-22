import { WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AddState,
  DeleteState,
  GetState,
  ListState,
  StoreActionCreator,
  StoreSelectorCreator,
  UpdateState
} from '../../store';
import { PageType } from '../enums/page.enum';
import { CrudConfig } from './crud-config.model';
import { Pagination } from './pagination.model';
import { RestListQuery } from './rest.model';
import { NuTable } from './table.model';
import { NuToolbar } from './toolbar.model';

// eslint-disable-next-line
type GenericTypedForm = any
// eslint-disable-next-line
type GenericRequest = any
// eslint-disable-next-line
type GenericResponse = any
// eslint-disable-next-line
type GenericMainState = any
type GenericListState = ListState<RestListQuery, GenericResponse>
type GenericGetState = GetState<GenericResponse>
type GenericAddState = AddState<GenericRequest, GenericResponse>
type GenericUpdateState = UpdateState<GenericRequest, GenericResponse>
type GenericDeleteState = DeleteState

const genericActions = {
  ...StoreActionCreator.createListGroup<RestListQuery, GenericResponse>(''),
  ...StoreActionCreator.createGetGroup<GenericResponse>(''),
  ...StoreActionCreator.createAddGroup<GenericRequest, GenericResponse>(''),
  ...StoreActionCreator.createUpdateGroup<GenericRequest, GenericResponse>(''),
  ...StoreActionCreator.createDeleteGroup('')
};

export interface GenericEntity<
  Full = unknown, List = Full[], Add = unknown, Update = unknown,
  Form = unknown, TypedFrom = GenericTypedForm, States = unknown,
  Config = CrudConfig<any, any, any, any>
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
      list: ReturnType<typeof StoreSelectorCreator.createList<GenericMainState, GenericListState>>['list'];
      get: ReturnType<typeof StoreSelectorCreator.createGet<GenericMainState, GenericGetState>>['get'];
      add: ReturnType<typeof StoreSelectorCreator.createAdd<GenericMainState, GenericAddState>>['add'];
      update: ReturnType<typeof StoreSelectorCreator.createUpdate<GenericMainState, GenericUpdateState>>['update'];
      delete: ReturnType<typeof StoreSelectorCreator.createDelete<GenericMainState, GenericDeleteState>>['delete'];
    }
  },
  config: Config;
}

export interface GenericListConsumer<T extends GenericEntity> {
  store: {
    actions: T['store']['actions'];
    selectors: T['store']['selectors'];
  },
  config: Readonly<T['config']>;
  isEmbedded: boolean;
  toolbar: NuToolbar;
  table: NuTable;
  data: WritableSignal<T['list']>;
  isDataLoading: WritableSignal<boolean>;
  pagination: WritableSignal<Pagination>;
  selectedRecords: WritableSignal<T['list']>;
  changeSelection: (selectedItems: T['list'] | T['list'][0]) => void;
}

export interface GenericFormConsumer<T extends GenericEntity> {
  store: {
    actions: T['store']['actions'];
    selectors: T['store']['selectors'];
  },
  id: string;
  config: Readonly<T['config']>;
  isEmbedded: boolean;
  toolbar: NuToolbar;
  pageType: PageType;
  form: FormGroup<T['typedForm']>;
  navigationState?: Record<string, unknown>;
  data: WritableSignal<T['full']>;
  title: WritableSignal<string>;
  isSubmitting: WritableSignal<boolean>;
  isSubmitted: WritableSignal<boolean>;
  save: () => void;
  formControlHasError: (controlName: string, error: string) => (boolean | undefined);
}
