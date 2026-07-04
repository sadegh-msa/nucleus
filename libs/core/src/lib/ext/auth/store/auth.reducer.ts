import { createReducer, on } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import type {
  AuthCheckState,
  AuthSignInState,
  AuthSignOutState,
  AuthSignUpState,
} from '../models/auth-state.model';
import { authActions } from './auth.actions';

const { Initial, InProgress, Success, Failure } = OperationStatus;

export const createAuthInitialState = <T>(type: string) => {
  return {
    type,
    request: {},
    response: {},
    message: '',
    status: Initial,
  } as T;
};

export const authReducers = {
  authSignIn: createReducer(
    createAuthInitialState<AuthSignInState>(authActions.signIn.type),
    on(authActions.signIn, (state, data) => ({ ...state, ...data, status: InProgress })),
    on(authActions.signInSuccess, (state, data) => ({ ...state, ...data, status: Success })),
    on(authActions.signInFailure, (state, data) => ({ ...state, ...data, status: Failure })),
  ),
  authSignUp: createReducer(
    createAuthInitialState<AuthSignUpState>(authActions.signUp.type),
    on(authActions.signUp, (state, data) => ({ ...state, ...data, status: InProgress })),
    on(authActions.signUpSuccess, (state, data) => ({ ...state, ...data, status: Success })),
    on(authActions.signUpFailure, (state, data) => ({ ...state, ...data, status: Failure })),
  ),
  authSignOut: createReducer(
    createAuthInitialState<AuthSignOutState>(authActions.signOut.type),
    on(authActions.signOut, (state) => ({ ...state, status: InProgress })),
    on(authActions.signOutSuccess, (state) => ({ ...state, status: Success })),
    on(authActions.signOutFailure, (state, data) => ({ ...state, ...data, status: Failure })),
  ),
  authCheck: createReducer(
    createAuthInitialState<AuthCheckState>(authActions.check.type),
    on(authActions.check, (state) => ({ ...state, status: InProgress })),
    on(authActions.checkSuccess, (state) => ({ ...state, status: Success })),
    on(authActions.checkFailure, (state, data) => ({ ...state, ...data, status: Failure })),
  ),
};
