export function mergeObjects<T = any>(a: any, b: any) {
  const res: Partial<Record<keyof T, unknown>> = {};
  const keys = Object.keys({ ...(a || {}), ...(b || {}) }) as (keyof T)[];

  for (let i = 0; i < keys.length; i++) {
    res[keys[i]] = b[keys[i]] ?? a[keys[i]];
  }

  return res as T;
}
