import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCanActivateSelf } from './auth-self.guard';

describe('authCanActivateSelf', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authCanActivateSelf(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
