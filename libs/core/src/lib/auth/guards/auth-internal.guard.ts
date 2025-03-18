import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authDefaultConfig } from '../auth-default.config';
import { AuthTokenService } from '../services/auth-token.service';


export const authCanActivate: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authTokenService = inject(AuthTokenService);
  const { isUserAuthenticated } = authTokenService;
  const { path } = authDefaultConfig;
  const signInPath = '/' + path.signIn;
  const signUpPath = '/' + path.signUp;
  const forgotPath = '/' + path.forgotPassword;

  if (isUserAuthenticated()) {
    if ([signInPath, signUpPath, forgotPath].includes(state.url)) {
      await router.navigate([path.root]);
      return false;
    }
  }

  return true;
};
