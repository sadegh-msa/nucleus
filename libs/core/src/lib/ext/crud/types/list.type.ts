export const listOrderLiterals = ['asc', 'desc'] as const;
export type ListOrderType = (typeof listOrderLiterals)[number];
