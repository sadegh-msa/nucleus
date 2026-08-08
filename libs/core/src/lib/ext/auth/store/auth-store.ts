import { computed, InjectionToken, inject, type Provider } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { UiMessageManager } from '@nucleus/ui';
import { formatErrorMessage } from '../../crud/helpers/format-messages-helper';
import type {
  AuthSignInModel,
  AuthSignUpModel,
  AuthStoreModel,
  AuthStoreStateModel,
} from '../models/auth-store.model';
import { AuthRest } from '../services/auth-rest';

const initialAuthState: AuthStoreStateModel = {
  signIn: {
    request: { email: '', password: '' },
    response: { token: { accessToken: null, refreshToken: null } },
    message: '',
    status: 'initial',
  },
  signUp: {
    request: { email: '', password: '' },
    response: { token: { accessToken: null, refreshToken: null } },
    message: '',
    status: 'initial',
  },
  signOut: { message: '', status: 'initial' },
  check: { status: 'initial' },
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
    isCheckSuccess: computed(() => state.check().status === 'success'),
    signInResponse: computed(() => state.signIn().response),
    signUpResponse: computed(() => state.signUp().response),
  })),

  withMethods((state) => {
    const authRestService = inject(AuthRest);
    const uiMessageManager = inject(UiMessageManager);

    return {
      doSignIn(request: AuthSignInModel) {
        patchState(state, { signIn: { ...state.signIn(), request, status: 'inProgress' } });
        authRestService.signIn(request).subscribe({
          next: (response) => {
            patchState(state, {
              signIn: {
                ...state.signIn(),
                response,
                message: $localize`You signed in successfully`,
                status: 'success',
              },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            uiMessageManager.addError(message);
            patchState(state, { signIn: { ...state.signIn(), message, status: 'failure' } });
          },
        });
      },

      doSignUp(request: AuthSignUpModel) {
        patchState(state, { signUp: { ...state.signUp(), request, status: 'inProgress' } });
        authRestService.signUp(request).subscribe({
          next: (response) => {
            const message = $localize`You signed up successfully`;
            uiMessageManager.addSuccess(message);
            patchState(state, {
              signUp: { ...state.signUp(), response, message, status: 'success' },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            uiMessageManager.addError(message);
            patchState(state, { signUp: { ...state.signUp(), message, status: 'failure' } });
          },
        });
      },

      doSignOut() {
        patchState(state, { signOut: { ...state.signOut(), status: 'inProgress' } });
        authRestService.signOut().subscribe({
          next: () => {
            const message = $localize`You signed out successfully`;
            patchState(state, {
              ...initialAuthState,
              signOut: { ...initialAuthState.signOut, message, status: 'success' },
            });
          },
          error: ({ error }: { error: any }) => {
            const message = formatErrorMessage(error);
            uiMessageManager.addError(message);
            patchState(state, { signOut: { ...state.signOut(), message, status: 'failure' } });
          },
        });
      },

      doCheckSuccess() {
        patchState(state, { check: { status: 'success' } });
      },

      doCheckFailure() {
        patchState(state, { check: { status: 'failure' } });
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
