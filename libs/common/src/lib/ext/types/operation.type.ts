export const operationStatusLiterals = ['initial', 'inProgress', 'failure', 'success'] as const;
export type OperationStatusType = (typeof operationStatusLiterals)[number];
