import type { ActionReducer } from '@ngrx/store';
import { authActions } from './auth.actions';

export function signOutMetaReducer(reducer: ActionReducer<any>) {
  return (state: any, action: any) =>
    reducer(action.type === authActions.signOutSuccess.type ? {} : state, action);
}
