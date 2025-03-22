import { createReducer, on } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import { StoreActionCreator } from './store-action.creator';
import { StoreStateCreator } from './store-state.creator';

export class StoreReducerCreator {
  static createList<State, Query, Response>(actions = (StoreActionCreator.createListGroup<Query, Response>(''))) {
    return {
      list: createReducer(
        StoreStateCreator.createList<State>(actions.list.type),
        on(
          actions.list,
          (state, data) => ({ ...state, ...data, status: OperationStatus.InProgress })
        ),
        on(
          actions.listSuccess,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Success })
        ),
        on(
          actions.listFailure,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Failure })
        ),
        on(
          actions.listReset,
          (state) => ({ ...state, ...StoreStateCreator.createList<State>(actions.list.type) })
        )
      )
    };
  }

  static createGet<State, Response>(actions = (StoreActionCreator.createGetGroup<Response>(''))) {
    return {
      get: createReducer(
        StoreStateCreator.createGet<State>(actions.get.type),
        on(
          actions.get,
          (state, data) => ({ ...state, ...data, status: OperationStatus.InProgress })
        ),
        on(
          actions.getMutate,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Pending })
        ),
        on(
          actions.getSuccess,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Success })
        ),
        on(
          actions.getFailure,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Failure })
        ),
        on(
          actions.getReset,
          (state) => ({ ...state, ...StoreStateCreator.createGet<State>(actions.get.type) })
        )
      )
    };
  }

  static createAdd<State, Request, Response>(actions = (StoreActionCreator.createAddGroup<Request, Response>(''))) {
    return {
      add: createReducer(
        StoreStateCreator.createAdd<State>(actions.add.type),
        on(
          actions.add,
          (state) => ({ ...state, status: OperationStatus.InProgress })
        ),
        on(
          actions.addSuccess,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Success })
        ),
        on(
          actions.addFailure,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Failure })
        ),
        on(
          actions.addReset,
          (state) => ({ ...state, ...StoreStateCreator.createAdd<State>(actions.add.type) })
        )
      )
    };
  }

  static createUpdate<State, Request, Response>(actions = (StoreActionCreator.createUpdateGroup<Request, Response>(''))) {
    return {
      update: createReducer(
        StoreStateCreator.createUpdate<State>(actions.update.type),
        on(
          actions.update,
          (state, data) => ({ ...state, ...data, status: OperationStatus.InProgress })
        ),
        on(
          actions.updateSuccess,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Success })
        ),
        on(
          actions.updateFailure,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Failure })
        ),
        on(
          actions.updateReset,
          (state) => ({ ...state, ...StoreStateCreator.createUpdate<State>(actions.update.type) })
        )
      )
    };
  }

  static createDelete<State>(actions = (StoreActionCreator.createDeleteGroup(''))) {
    return {
      delete: createReducer(
        StoreStateCreator.createDelete<State>(actions.delete.type),
        on(
          actions.delete,
          (state, data) => ({ ...state, ...data, status: OperationStatus.InProgress })
        ),
        on(
          actions.deleteSuccess,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Success })
        ),
        on(
          actions.deleteFailure,
          (state, data) => ({ ...state, ...data, status: OperationStatus.Failure })
        ),
        on(
          actions.deleteReset,
          (state) => ({ ...state, ...StoreStateCreator.createDelete<State>(actions.delete.type) })
        )
      )
    };
  }
}
