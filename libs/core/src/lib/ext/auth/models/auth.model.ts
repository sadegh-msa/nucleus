import type { TypedFormModel } from '../../crud/models/form.model'; // Possibility of circular dependency

export interface AuthTokenModel {
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe?: boolean;
}

export interface AuthSignInModel {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSignUpModel {
  email: string;
  password: string;
}

export interface AuthSignInResponseModel {
  token: AuthTokenModel;
}

export interface AuthSignUpResponseModel {
  token: AuthTokenModel;
}

export type AuthSignInFormModel = TypedFormModel<AuthSignInModel>;
export type AuthSignUpFormModel = TypedFormModel<AuthSignUpModel & { confirmPassword: string }>;
