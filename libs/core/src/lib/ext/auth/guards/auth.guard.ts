import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

export const authCanActivate: CanActivateFn = async (route, state) => {
  const authService = inject(AuthTokenService);

  return (await authService.isAuthenticated()) && !authService.isAuthRouteActivated(state.url);
};
