import { createReducer, on } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import {
  createAddStoreActionGroup,
  createDeleteStoreActionGroup,
  createGetStoreActionGroup,
  createListStoreActionGroup,
  createUpdateStoreActionGroup,
} from './store-action.creator';
import {
  createAddStoreState,
  createDeleteStoreState,
  createGetStoreState,
  createListStoreState,
  createUpdateStoreState,
} from './store-state.creator';

export function createListStoreReducer<State, Query, Response>(
  actions = createListStoreActionGroup<Query, Response>(''),
) {
  return {
    list: createReducer(
      createListStoreState<State>(actions.list.type),
      on(actions.list, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.InProgress,
      })),
      on(actions.listSuccess, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Success,
      })),
      on(actions.listFailure, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Failure,
      })),
      on(actions.listReset, (state) => ({
        ...state,
        ...createListStoreState<State>(actions.list.type),
      })),
    ),
  };
}

export function createGetStoreReducer<State, Response>(
  actions = createGetStoreActionGroup<Response>(''),
) {
  return {
    get: createReducer(
      createGetStoreState<State>(actions.get.type),
      on(actions.get, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.InProgress,
      })),
      on(actions.getMutate, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Pending,
      })),
      on(actions.getSuccess, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Success,
      })),
      on(actions.getFailure, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Failure,
      })),
      on(actions.getReset, (state) => ({
        ...state,
        ...createGetStoreState<State>(actions.get.type),
      })),
    ),
  };
}

export function createAddStoreReducer<State, Request, Response>(
  actions = createAddStoreActionGroup<Request, Response>(''),
) {
  return {
    add: createReducer(
      createAddStoreState<State>(actions.add.type),
      on(actions.add, (state) => ({ ...state, status: OperationStatus.InProgress })),
      on(actions.addSuccess, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Success,
      })),
      on(actions.addFailure, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Failure,
      })),
      on(actions.addReset, (state) => ({
        ...state,
        ...createAddStoreState<State>(actions.add.type),
      })),
    ),
  };
}

export function createUpdateStoreReducer<State, Request, Response>(
  actions = createUpdateStoreActionGroup<Request, Response>(''),
) {
  return {
    update: createReducer(
      createUpdateStoreState<State>(actions.update.type),
      on(actions.update, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.InProgress,
      })),
      on(actions.updateSuccess, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Success,
      })),
      on(actions.updateFailure, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Failure,
      })),
      on(actions.updateReset, (state) => ({
        ...state,
        ...createUpdateStoreState<State>(actions.update.type),
      })),
    ),
  };
}

export function createDeleteStoreReducer<State>(actions = createDeleteStoreActionGroup('')) {
  return {
    delete: createReducer(
      createDeleteStoreState<State>(actions.delete.type),
      on(actions.delete, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.InProgress,
      })),
      on(actions.deleteSuccess, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Success,
      })),
      on(actions.deleteFailure, (state, data) => ({
        ...state,
        ...data,
        status: OperationStatus.Failure,
      })),
      on(actions.deleteReset, (state) => ({
        ...state,
        ...createDeleteStoreState<State>(actions.delete.type),
      })),
    ),
  };
}
