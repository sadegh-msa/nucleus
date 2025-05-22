export const extents = ['compact', 'wide'] as const;
export type Extent = (typeof extents)[number];
