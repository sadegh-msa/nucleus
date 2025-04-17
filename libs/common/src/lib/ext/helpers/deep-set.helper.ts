function deepSetObjectValue(obj: any, keys: string[], getValue: (v: any) => any, index = 0) {
  if (obj[keys[index]]) {
    deepSetObjectValue(obj[keys[index]], keys, getValue, index++);
    return;
  }

  obj[keys[index + 1]] = getValue(obj[keys[index + 1]]);
}

export function deepSet(obj: any, path: string, getValue: (v: any) => any) {
  return deepSetObjectValue(obj, path.split('.'), getValue);
}
