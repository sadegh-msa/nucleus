export const extentLiterals = ['compact', 'wide'] as const;
export type ExtentType = (typeof extentLiterals)[number];
