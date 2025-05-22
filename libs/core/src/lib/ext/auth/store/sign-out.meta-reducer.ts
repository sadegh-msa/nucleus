import { ActionReducer } from '@ngrx/store';
import { authActions } from './auth.actions';

export function signOutMetaReducer(reducer: ActionReducer<any>) {
  return function (state: any, action: any) {
    return reducer(action.type === authActions.signOutSuccess.type ? {} : state, action);
  };
}
