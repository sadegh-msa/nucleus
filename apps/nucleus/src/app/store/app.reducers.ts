import { authReducers } from '@nucleus/core';
import { sampleReducers } from '../pages/sample';

export const appReducers = {
  ...authReducers,
  ...sampleReducers,
};
