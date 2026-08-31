const signIn = 'signin';
const signUp = 'signup';
const resetPassword = 'reset-password';

export const authInternalConfig = Object.freeze({
  entity: {
    signIn: {
      html: { form: { id: `${signIn}-form` } },
      route: {
        path: signIn,
        title: $localize`Sign in`,
      },
    },
    signUp: {
      html: { form: { id: `${signUp}-form` } },
      route: {
        path: signUp,
        title: $localize`Sign up`,
      },
    },
    resetPassword: {
      html: { form: { id: `${resetPassword}-form` } },
      route: {
        path: resetPassword,
        title: $localize`Reset password`,
      },
    },
  },
  rest: {
    endpoint: 'auth',
  },
  token: {
    cookieAccessTokenKey: 'aat',
    requestedUrlKey: 'requestedUrl',
    deadlineExtenderTime: 60 * 1000,
  },
});
