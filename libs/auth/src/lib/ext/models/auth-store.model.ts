import type { OperationStatusType } from '@nucleus/common';
import type {
  AuthSignInModel,
  AuthSignInResponseModel,
  AuthSignUpModel,
  AuthSignUpResponseModel,
} from './auth.model';

export type {
  AuthSignInModel,
  AuthSignInResponseModel,
  AuthSignUpModel,
  AuthSignUpResponseModel,
} from './auth.model';

export interface AuthSignInStateModel {
  request: AuthSignInModel;
  response: AuthSignInResponseModel;
  message: string;
  status: OperationStatusType;
}

export interface AuthSignUpStateModel {
  request: AuthSignUpModel;
  response: AuthSignUpResponseModel;
  message: string;
  status: OperationStatusType;
}

export interface AuthSignOutStateModel {
  message: string;
  status: OperationStatusType;
}

export interface AuthCheckStateModel {
  status: OperationStatusType;
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
  checkStatus(): OperationStatusType;
  signInStatus(): OperationStatusType;
  signUpStatus(): OperationStatusType;
  signOutStatus(): OperationStatusType;
  isCheckSuccess(): boolean;
  signInResponse(): AuthSignInResponseModel;
  signUpResponse(): AuthSignUpResponseModel;
  signInState(): AuthSignInStateModel;
  signUpState(): AuthSignUpStateModel;
  signOutState(): AuthSignOutStateModel;
  checkState(): AuthCheckStateModel;
}
