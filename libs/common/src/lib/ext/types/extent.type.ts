export const extents = ['compact', 'wide'] as const;
export type ExtentType = (typeof extents)[number];
