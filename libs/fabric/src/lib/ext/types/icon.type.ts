export const iconVariants = [
  'animation'
  , 'bold'
  , 'brand'
  , 'broken'
  , 'bulk'
  , 'intact'
  , 'linear'
  , 'outline'
  , 'twotone'
] as const;
export type IconVariant = typeof iconVariants[number];

