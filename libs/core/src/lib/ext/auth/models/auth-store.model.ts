import type { OperationStatus } from '@nucleus/common';
import type { AuthSignInModel, AuthSignInResponseModel, AuthSignUpModel, AuthSignUpResponseModel } from './auth.model';

export type { AuthSignInModel, AuthSignInResponseModel, AuthSignUpModel, AuthSignUpResponseModel } from './auth.model';

export interface AuthSignInStateModel {
  request: AuthSignInModel;
  response: AuthSignInResponseModel;
  message: string;
  status: OperationStatus;
}

export interface AuthSignUpStateModel {
  request: AuthSignUpModel;
  response: AuthSignUpResponseModel;
  message: string;
  status: OperationStatus;
}

export interface AuthSignOutStateModel {
  message: string;
  status: OperationStatus;
}

export interface AuthCheckStateModel {
  status: OperationStatus;
}

export interface AuthStoreStateModel {
  signIn: AuthSignInStateModel;
  signUp: AuthSignUpStateModel;
  signOut: AuthSignOutStateModel;
  check: AuthCheckStateModel;
}

export interface AuthStoreModel {
  signIn(request: AuthSignInModel): void;
  signUp(request: AuthSignUpModel): void;
  signOut(): void;
  checkSuccess(): void;
  checkFailure(): void;
  checkStatus(): OperationStatus;
  signInStatus(): OperationStatus;
  signUpStatus(): OperationStatus;
  signOutStatus(): OperationStatus;
  isCheckSuccess(): boolean;
  signInResponse(): AuthSignInResponseModel;
  signUpResponse(): AuthSignUpResponseModel;
  signInState(): AuthSignInStateModel;
  signUpState(): AuthSignUpStateModel;
  signOutState(): AuthSignOutStateModel;
  checkState(): AuthCheckStateModel;
}
