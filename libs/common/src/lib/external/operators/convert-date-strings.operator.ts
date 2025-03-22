import { map, Observable } from 'rxjs';
import { deepSet } from '../helpers/deep-set.helper';

export function convertDateStrings<T>(...fieldPaths: string[]): (source$: Observable<T>) => Observable<T> {
  return (source$) => {
    return source$.pipe(map(payload => {
      if (!Object.keys(payload || {}).length) {
        return payload;
      }

      const result = structuredClone(payload || {}) as Record<string, any>;

      for (const fieldPath of fieldPaths) {
        deepSet(result, fieldPath, (v) => new Date(v));
      }

      return result as T;
    }));
  };
}
