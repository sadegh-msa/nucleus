import { authReducers } from '@nucleus/core';
import { sampleReducers } from '../pages/crud/sample';

export const appReducers = {
  ...authReducers,
  ...sampleReducers,
};
