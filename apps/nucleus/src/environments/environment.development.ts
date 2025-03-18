import { environment as commonEnv } from './environment.common';

export const environment = {
  ...commonEnv,
  rest: {
    url: 'https://mockoon.localhost:3000/api'
  }
};
