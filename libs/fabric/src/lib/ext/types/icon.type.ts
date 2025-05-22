export const iconVariants = [
  'animation'
  , 'bold'
  , 'brand'
  , 'broken'
  , 'bulk'
  , 'colored'
  , 'linear'
  , 'outline'
  , 'twotone'
] as const;
export type IconVariant = typeof iconVariants[number];

