import { createSelector } from '@ngrx/store';
import { AddState, DeleteState, GetState, ListState, UpdateState } from '../models/state.model';

export class StoreSelectorCreator {
  static createList<MainState, State extends ListState<unknown, unknown>>(select: (mainState: MainState) => State) {
    return {
      list: {
        state: createSelector(select, state => state),
        query: createSelector(select, state => state.query),
        response: createSelector(select, state => state.response),
        message: createSelector(select, state => state.message),
        status: createSelector(select, state => state.status)
      }
    };
  }

  static createGet<MainState, State extends GetState<unknown>>(select: (mainState: MainState) => State) {
    return {
      get: {
        state: createSelector(select, state => state),
        query: createSelector(select, state => state.query),
        response: createSelector(select, state => state.response),
        message: createSelector(select, state => state.message),
        status: createSelector(select, state => state.status)
      }
    };
  }

  static createAdd<MainState, State extends AddState<unknown, unknown>>(select: (mainState: MainState) => State) {
    return {
      add: {
        state: createSelector(select, state => state),
        request: createSelector(select, state => state.request),
        response: createSelector(select, state => state.response),
        message: createSelector(select, state => state.message),
        status: createSelector(select, state => state.status)
      }
    };
  }

  static createUpdate<MainState, State extends UpdateState<unknown, unknown>>(select: (mainState: MainState) => State) {
    return {
      update: {
        state: createSelector(select, state => state),
        query: createSelector(select, state => state.query),
        request: createSelector(select, state => state.request),
        response: createSelector(select, state => state.response),
        message: createSelector(select, state => state.message),
        status: createSelector(select, state => state.status)
      }
    };
  }

  static createDelete<MainState, State extends DeleteState>(select: (mainState: MainState) => State) {
    return {
      delete: {
        state: createSelector(select, state => state),
        query: createSelector(select, state => state.response),
        response: createSelector(select, state => state.response),
        message: createSelector(select, state => state.message),
        status: createSelector(select, state => state.status)
      }
    };
  }
}
