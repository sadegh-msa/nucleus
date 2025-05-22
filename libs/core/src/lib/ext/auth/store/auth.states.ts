import type {
  AuthCheckState,
  AuthSignInState,
  AuthSignOutState,
  AuthSignUpState,
} from '../models/auth-state.model';

export interface AuthStates {
  authSignIn: AuthSignInState;
  authSignUp: AuthSignUpState;
  authSignOut: AuthSignOutState;
  authCheck: AuthCheckState;
}
