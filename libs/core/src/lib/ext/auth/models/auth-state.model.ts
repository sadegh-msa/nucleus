import type { ActionSuccess } from '../../store/models/action.model'; // Possibility of circular dependency
import type { CommonState } from '../../store/models/state.model'; // Possibility of circular dependency
import type { AuthSignIn, AuthSignInResponse, AuthSignUp, AuthSignUpResponse } from './auth.model';

export interface AuthSignInState extends CommonState {
  request: AuthSignIn;
  response: AuthSignInResponse;
}

export interface AuthSignUpState extends CommonState {
  request: AuthSignUp;
  response: AuthSignUpResponse;
}

export interface AuthSignOutState extends CommonState {
  request: unknown;
  response: unknown;
}

export interface ActionAuthSignIn {
  request: AuthSignIn;
}

export interface ActionAuthSignInSuccess extends ActionSuccess {
  response: AuthSignInResponse;
}

export interface ActionAuthSignUp {
  request: AuthSignUp;
}

export interface ActionAuthSignUpSuccess extends ActionSuccess {
  response: AuthSignUpResponse;
}

export type AuthCheckState = CommonState;
