export const uiIconVariants = [
  'animation',
  'bold',
  'brand',
  'broken',
  'bulk',
  'intact',
  'linear',
  'outline',
  'twotone',
] as const;
export type UiIconVariant = (typeof uiIconVariants)[number];
