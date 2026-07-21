import { map, type Observable } from 'rxjs';
import { deepSet } from '../utils/object-utils';

export function convertDateStrings<T>(
  ...fieldPaths: string[]
): (source$: Observable<T>) => Observable<T> {
  return (source$) => {
    return source$.pipe(
      map((payload) => {
        if (!Object.keys(payload || {}).length) {
          return payload;
        }

        const result = structuredClone(payload || {}) as Record<string, any>;

        for (const fieldPath of fieldPaths) {
          deepSet(result, fieldPath, (v) => new Date(v));
        }

        return result as T;
      }),
    );
  };
}
