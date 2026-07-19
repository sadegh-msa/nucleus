import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthToken } from '../services/auth-token';

export const authCanActivate: CanActivateFn = async (route, state) => {
  const authService = inject(AuthToken);

  return (await authService.isAuthenticated()) && !authService.isAuthRouteActivated(state.url);
};
