import { createSelector } from '@ngrx/store';
import type {
  AuthCheckState,
  AuthSignInState,
  AuthSignOutState,
  AuthSignUpState,
} from '../models/auth-state.model';
import type { AuthStates } from './auth.states';

const selectSignIn = (state: AuthStates) => state.authSignIn;
const selectSignUp = (state: AuthStates) => state.authSignUp;
const selectSignOut = (state: AuthStates) => state.authSignOut;
const selectCheck = (state: AuthStates) => state.authCheck;

export const authSelectors = {
  signIn: {
    state: createSelector(selectSignIn, (state: AuthSignInState) => state),
    request: createSelector(selectSignIn, (state: AuthSignInState) => state.request),
    response: createSelector(selectSignIn, (state: AuthSignInState) => state.response),
    message: createSelector(selectSignIn, (state: AuthSignInState) => state.message),
    status: createSelector(selectSignIn, (state: AuthSignInState) => state.status),
  },

  signUp: {
    state: createSelector(selectSignUp, (state: AuthSignUpState) => state),
    request: createSelector(selectSignUp, (state: AuthSignUpState) => state.request),
    response: createSelector(selectSignUp, (state: AuthSignUpState) => state.response),
    message: createSelector(selectSignUp, (state: AuthSignUpState) => state.message),
    status: createSelector(selectSignUp, (state: AuthSignUpState) => state.status),
  },

  signOut: {
    state: createSelector(selectSignOut, (state: AuthSignOutState) => state),
    message: createSelector(selectSignOut, (state: AuthSignOutState) => state.message),
    status: createSelector(selectSignOut, (state: AuthSignOutState) => state.status),
  },

  check: {
    state: createSelector(selectCheck, (state: AuthCheckState) => state),
    message: createSelector(selectCheck, (state: AuthCheckState) => state.message),
    status: createSelector(selectCheck, (state: AuthCheckState) => state.status),
  },
};
