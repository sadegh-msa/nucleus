export const screenSizeLiterals = ['sm', 'md', 'lg', 'xl', 'xxl', 'tablet', 'web'] as const;
export type ScreenSizeType = (typeof screenSizeLiterals)[number];
