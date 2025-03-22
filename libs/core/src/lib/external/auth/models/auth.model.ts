import { TypedForm } from '../../crud';

export interface AuthToken {
  access_token: string | null;
  refresh_token: string | null;
  remember_me?: boolean;
}

export interface AuthSignIn {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSignUp {
  email: string;
  password: string;
}

export interface AuthSignInResponse {
  token: AuthToken;
}

export interface AuthSignUpResponse {
  token: AuthToken;
}

export type AuthSignInForm = TypedForm<AuthSignIn>
export type AuthSignUpForm = TypedForm<AuthSignUp & { confirmPassword: string }>
