import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

export const authCanActivate: CanActivateFn = (route, state) => {
  const authTokenService = inject(AuthTokenService);

  return authTokenService.isUserAuthenticated();
};
