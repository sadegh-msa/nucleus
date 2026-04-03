import type { RestError } from '../models/rest.model';

export const formatErrorMessage = (error: RestError) => {
  return `${error?.code}: ${error?.reason}`;
};
