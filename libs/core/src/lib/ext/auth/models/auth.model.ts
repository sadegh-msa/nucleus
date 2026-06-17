import type { TypedForm } from '../../crud/models/form.model'; // Possibility of circular dependency

export interface AuthToken {
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe?: boolean;
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

export type AuthSignInForm = TypedForm<AuthSignIn>;
export type AuthSignUpForm = TypedForm<AuthSignUp & { confirmPassword: string }>;
