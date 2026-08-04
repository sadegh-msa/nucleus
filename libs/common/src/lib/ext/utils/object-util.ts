import * as R from 'ramda';

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

export function mergeAll<T = any>(...objects: any[]) {
  return R.mergeAll<T>(objects) as T;
}

export function mergeAllIgnoreNil<T = any>(...objects: any[]) {
  return R.reduce(
    R.mergeWith((l, r) => (R.isNil(r) ? l : r)),
    {},
  )(objects) as T;
}

export function patchExisting<T>(target: T, source: Partial<T>): T {
  return R.mergeRight(target as object, R.pick(R.keys(target as object), source)) as T;
}

export function mergeDeepLeft<T>(left: any, right: any) {
  return R.mergeDeepLeft(left, right) as T;
}

export function mergeDeepRight<T>(left: any, right: any) {
  return R.mergeDeepRight(left, right) as T;
}
