export const uiIconVariants = [
  'animation',
  'bold',
  'bold-duotone',
  'broken',
  'linear',
  'liner-duotone',
  'outline',
  'intact',
  'brand',
] as const;
export type UiIconVariant = (typeof uiIconVariants)[number];
