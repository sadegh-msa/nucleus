import { computed, InjectionToken, inject, type Provider } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { OperationStatus } from '@nucleus/common';
import { MessageService } from '@nucleus/ui';
import { formatErrorMessage } from '../../crud/helpers/format-messages.helper';
import type {
  AuthSignInModel,
  AuthSignUpModel,
  AuthStoreModel,
  AuthStoreStateModel,
} from '../models/auth-store.model';
import { AuthRestService } from '../services/auth-rest.service';

const { Initial, InProgress, Success, Failure } = OperationStatus;

const initialAuthState: AuthStoreStateModel = {
  signIn: {
    request: { email: '', password: '' },
    response: { token: { accessToken: null, refreshToken: null } },
    message: '',
    status: Initial,
  },
  signUp: {
    request: { email: '', password: '' },
    response: { token: { accessToken: null, refreshToken: null } },
    message: '',
    status: Initial,
  },
  signOut: { message: '', status: Initial },
  check: { status: Initial },
};

const AUTH_STORE = new InjectionToken<AuthStoreModel>('AuthStore');

const AuthSignalStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialAuthState),

  withComputed((state) => ({
    checkStatus: computed(() => state.check().status),
    signInStatus: computed(() => state.signIn().status),
    signUpStatus: computed(() => state.signUp().status),
    signOutStatus: computed(() => state.signOut().status),
    isCheckSuccess: computed(() => state.check().status === Success),
    signInResponse: computed(() => state.signIn().response),
    signUpResponse: computed(() => state.signUp().response),
  })),

  withMethods((state) => {
    const authRestService = inject(AuthRestService);
    const messageService = inject(MessageService);

    return {
      doSignIn(request: AuthSignInModel) {
        patchState(state, { signIn: { ...state.signIn(), request, status: InProgress } });
        authRestService.signIn(request).subscribe({
          next: (response) => {
            patchState(state, {
              signIn: {
                ...state.signIn(),
                response,
                message: $localize`You signed in successfully`,
                status: Success,
              },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);
            patchState(state, { signIn: { ...state.signIn(), message, status: Failure } });
          },
        });
      },

      doSignUp(request: AuthSignUpModel) {
        patchState(state, { signUp: { ...state.signUp(), request, status: InProgress } });
        authRestService.signUp(request).subscribe({
          next: (response) => {
            const message = $localize`You signed up successfully`;
            messageService.addSuccess(message);
            patchState(state, {
              signUp: { ...state.signUp(), response, message, status: Success },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);
            patchState(state, { signUp: { ...state.signUp(), message, status: Failure } });
          },
        });
      },

      doSignOut() {
        patchState(state, { signOut: { ...state.signOut(), status: InProgress } });
        authRestService.signOut().subscribe({
          next: () => {
            const message = $localize`You signed out successfully`;
            patchState(state, {
              ...initialAuthState,
              signOut: { ...initialAuthState.signOut, message, status: Success },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);
            patchState(state, { signOut: { ...state.signOut(), message, status: Failure } });
          },
        });
      },

      doCheckSuccess() {
        patchState(state, { check: { status: Success } });
      },

      doCheckFailure() {
        patchState(state, { check: { status: Failure } });
      },
    };
  }),
);

function createAuthStoreInstance(): AuthStoreModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = inject(AuthSignalStore as any) as any;

  return {
    signIn: (req) => instance.doSignIn(req),
    signUp: (req) => instance.doSignUp(req),
    signOut: () => instance.doSignOut(),
    checkSuccess: () => instance.doCheckSuccess(),
    checkFailure: () => instance.doCheckFailure(),
    checkStatus: () => instance.checkStatus(),
    signInStatus: () => instance.signInStatus(),
    signUpStatus: () => instance.signUpStatus(),
    signOutStatus: () => instance.signOutStatus(),
    isCheckSuccess: () => instance.isCheckSuccess(),
    signInResponse: () => instance.signInResponse(),
    signUpResponse: () => instance.signUpResponse(),
    signInState: () => instance.signIn(),
    signUpState: () => instance.signUp(),
    signOutState: () => instance.signOut(),
    checkState: () => instance.check(),
  };
}

export function provideAuthStore(): Provider[] {
  return [AuthSignalStore, { provide: AUTH_STORE, useFactory: createAuthStoreInstance }];
}

export function injectAuthStore(): AuthStoreModel {
  return inject(AUTH_STORE);
}
