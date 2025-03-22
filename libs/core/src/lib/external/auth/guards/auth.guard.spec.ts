import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCanActivate } from './auth.guard';

describe('authCanActivate', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authCanActivate(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
