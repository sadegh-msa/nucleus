export const authInternalConfig = Object.freeze({
  rest: {
    endpoint: 'auth',
  },
  routes: {
    signIn: {
      path: 'signin',
      title: $localize`Sign in`,
    },
    signUp: {
      path: 'signup',
      title: $localize`Sign up`,
    },
    resetPassword: {
      path: 'reset-password',
      title: $localize`Reset password`,
    },
  },
  token: {
    cookieAccessTokenKey: 'aat',
    requestedUrlKey: 'requestedUrl',
    deadlineExtenderTime: 60 * 1000,
  },
});
