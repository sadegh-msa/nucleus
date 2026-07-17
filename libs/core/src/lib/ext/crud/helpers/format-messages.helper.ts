import type { RestErrorModel } from '../models/rest.model';

export const formatErrorMessage = (error: RestErrorModel) => {
  return `${error?.code}: ${error?.reason}`;
};
