export const dataLiterals = [
  'index',
  'text',
  'numeric',
  'datetime',
  'currency',
  'boolean',
  'enum',
  'reference',
] as const;

export type DataType = (typeof dataLiterals)[number];
