import type { OperationStatus } from '@nucleus/common';
import type { AuthSignIn, AuthSignInResponse, AuthSignUp, AuthSignUpResponse } from './auth.model';

export type { AuthSignIn, AuthSignInResponse, AuthSignUp, AuthSignUpResponse } from './auth.model';

export interface AuthSignInState {
  request: AuthSignIn;
  response: AuthSignInResponse;
  message: string;
  status: OperationStatus;
}

export interface AuthSignUpState {
  request: AuthSignUp;
  response: AuthSignUpResponse;
  message: string;
  status: OperationStatus;
}

export interface AuthSignOutState {
  message: string;
  status: OperationStatus;
}

export interface AuthCheckState {
  status: OperationStatus;
}

export interface AuthStoreState {
  signIn: AuthSignInState;
  signUp: AuthSignUpState;
  signOut: AuthSignOutState;
  check: AuthCheckState;
}

export interface AuthStore {
  signIn(request: AuthSignIn): void;
  signUp(request: AuthSignUp): void;
  signOut(): void;
  checkSuccess(): void;
  checkFailure(): void;
  checkStatus(): OperationStatus;
  signInStatus(): OperationStatus;
  signUpStatus(): OperationStatus;
  signOutStatus(): OperationStatus;
  isCheckSuccess(): boolean;
  signInResponse(): AuthSignInResponse;
  signUpResponse(): AuthSignUpResponse;
  signInState(): AuthSignInState;
  signUpState(): AuthSignUpState;
  signOutState(): AuthSignOutState;
  checkState(): AuthCheckState;
}
