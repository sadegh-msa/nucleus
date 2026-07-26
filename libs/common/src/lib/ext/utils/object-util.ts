export function mergeObjects<T = any>(a: any, b: any) {
  const res: Partial<Record<keyof T, unknown>> = {};
  const keys = Object.keys({ ...(a || {}), ...(b || {}) }) as (keyof T)[];

  for (let i = 0; i < keys.length; i++) {
    res[keys[i]] = b[keys[i]] ?? a[keys[i]];
  }

  return res as T;
}

function deepSetObjectValue(obj: any, keys: string[], getValue: (v: any) => any, index = 0) {
  if (index >= keys.length - 1) {
    obj[keys[index]] = getValue(obj[keys[index]]);
    return;
  }

  const next = obj[keys[index]] ?? {};
  obj[keys[index]] = next;
  deepSetObjectValue(next, keys, getValue, index + 1);
}

export function deepSet(obj: any, path: string, getValue: (v: any) => any) {
  return deepSetObjectValue(obj, path.split('.'), getValue);
}
