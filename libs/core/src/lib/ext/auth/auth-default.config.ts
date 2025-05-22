export const authDefaultConfig = Object.freeze({
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
});
