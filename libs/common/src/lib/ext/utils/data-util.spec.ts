import { describe, expect, it } from 'vitest';
import {
  deepSet,
  equals,
  isEmpty,
  isNil,
  isNotEmpty,
  isNotNil,
  mergeAll,
  mergeAllIgnoreNil,
  mergeDeepLeft,
  mergeDeepRight,
  patchExisting,
} from './data-util';

describe('equals', () => {
  it('should return true for equal primitives', () => {
    expect(equals(1, 1)).toBe(true);
    expect(equals('a', 'a')).toBe(true);
    expect(equals(true, true)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(equals(1, 2)).toBe(false);
    expect(equals('a', 'b')).toBe(false);
    expect(equals(true, false)).toBe(false);
  });

  it('should return true for equal arrays', () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(equals(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('should return false for different arrays', () => {
    expect(equals([1, 2], [2, 1])).toBe(false);
    expect(equals([1, 2], [1, 2, 3])).toBe(false);
  });

  it('should return true for equal objects', () => {
    expect(equals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(equals({ x: { y: 1 } }, { x: { y: 1 } })).toBe(true);
  });

  it('should return false for different objects', () => {
    expect(equals({ a: 1 }, { a: 2 })).toBe(false);
    expect(equals({ a: 1 }, { b: 1 })).toBe(false);
    expect(equals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('should return true for null and null', () => {
    expect(equals(null, null)).toBe(true);
  });

  it('should return true for undefined and undefined', () => {
    expect(equals(undefined, undefined)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(equals(null, undefined)).toBe(false);
  });

  it('should handle Date objects', () => {
    const d1 = new Date('2024-01-01');
    const d2 = new Date('2024-01-01');
    const d3 = new Date('2024-01-02');
    expect(equals(d1, d2)).toBe(true);
    expect(equals(d1, d3)).toBe(false);
  });

  it('should handle nested structures', () => {
    const a = { a: [1, { b: 2 }], c: { d: [3, 4] } };
    const b = { a: [1, { b: 2 }], c: { d: [3, 4] } };
    expect(equals(a, b)).toBe(true);
  });
});

describe('isEmpty', () => {
  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for null (Ramda behavior)', () => {
    expect(isEmpty(null)).toBe(false);
  });

  it('should return false for undefined (Ramda behavior)', () => {
    expect(isEmpty(undefined)).toBe(false);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2])).toBe(false);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('should return false for number', () => {
    expect(isEmpty(0)).toBe(false);
  });
});

describe('isNil', () => {
  it('should return true for null', () => {
    expect(isNil(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(isNil('')).toBe(false);
  });

  it('should return false for 0', () => {
    expect(isNil(0)).toBe(false);
  });

  it('should return false for false', () => {
    expect(isNil(false)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isNil([])).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(isNil({})).toBe(false);
  });
});

describe('isNotEmpty', () => {
  it('should return false for empty string', () => {
    expect(isNotEmpty('')).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isNotEmpty([])).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(isNotEmpty({})).toBe(false);
  });

  it('should return true for null (inverse of isEmpty)', () => {
    expect(isNotEmpty(null)).toBe(true);
  });

  it('should return true for undefined (inverse of isEmpty)', () => {
    expect(isNotEmpty(undefined)).toBe(true);
  });

  it('should return true for non-empty string', () => {
    expect(isNotEmpty('hello')).toBe(true);
  });

  it('should return true for non-empty array', () => {
    expect(isNotEmpty([1, 2])).toBe(true);
  });

  it('should return true for non-empty object', () => {
    expect(isNotEmpty({ a: 1 })).toBe(true);
  });
});

describe('isNotNil', () => {
  it('should return false for null', () => {
    expect(isNotNil(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNotNil(undefined)).toBe(false);
  });

  it('should return true for empty string', () => {
    expect(isNotNil('')).toBe(true);
  });

  it('should return true for 0', () => {
    expect(isNotNil(0)).toBe(true);
  });

  it('should return true for false', () => {
    expect(isNotNil(false)).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isNotNil([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isNotNil({})).toBe(true);
  });
});

describe('mergeAll', () => {
  it('should merge two objects with b taking priority', () => {
    const a = { x: 1, y: 2 };
    const b = { y: 3, z: 4 };
    expect(mergeAll(a, b)).toEqual({ x: 1, y: 3, z: 4 });
  });

  it('should return a when b is empty', () => {
    expect(mergeAll({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it('should return b when a is empty', () => {
    expect(mergeAll({}, { b: 2 })).toEqual({ b: 2 });
  });

  it('should overwrite with b value when b value is null', () => {
    expect(mergeAll({ a: 1 }, { a: null })).toEqual({ a: null });
  });

  it('should overwrite with b value when b value is undefined', () => {
    expect(mergeAll({ a: 1 }, { a: undefined })).toEqual({ a: undefined });
  });

  it('should overwrite with b value when b value is 0', () => {
    expect(mergeAll({ a: 1 }, { a: 0 })).toEqual({ a: 0 });
  });

  it('should overwrite with b value when b value is empty string', () => {
    expect(mergeAll({ a: 'x' }, { a: '' })).toEqual({ a: '' });
  });
});

describe('deepSet', () => {
  it('should set a value at a single-key path', () => {
    const obj = {};
    deepSet(obj, 'a', () => 1);
    expect(obj).toEqual({ a: 1 });
  });

  it('should set a value at a nested path', () => {
    const obj = {};
    deepSet(obj, 'a.b.c', () => 'deep');
    expect(obj).toEqual({ a: { b: { c: 'deep' } } });
  });

  it('should overwrite an existing value', () => {
    const obj = { a: { b: 2 } };
    deepSet(obj, 'a.b', () => 99);
    expect(obj).toEqual({ a: { b: 99 } });
  });

  it('should preserve sibling keys', () => {
    const obj = { a: { x: 1, y: 2 } };
    deepSet(obj, 'a.x', () => 10);
    expect(obj).toEqual({ a: { x: 10, y: 2 } });
  });

  it('should call getValue with the current object at each level', () => {
    const calls: unknown[] = [];
    const obj = { a: { b: {} } };
    deepSet(obj, 'a.b', (current) => {
      calls.push(current);
      return 'val';
    });
    expect(calls.length).toBe(1);
    expect(obj).toEqual({ a: { b: 'val' } });
  });

  it('should work with a two-level path', () => {
    const obj = {};
    deepSet(obj, 'x.y', () => 42);
    expect(obj).toEqual({ x: { y: 42 } });
  });

  it('should work with a four-level path', () => {
    const obj = {};
    deepSet(obj, 'a.b.c.d', () => 'deep');
    expect(obj).toEqual({ a: { b: { c: { d: 'deep' } } } });
  });
});

describe('patchExisting', () => {
  it('should merge only keys that exist in target', () => {
    const target = { a: 1, b: 2 };
    const source = { a: 10, c: 30 };
    expect(patchExisting(target, source)).toEqual({ a: 10, b: 2 });
  });

  it('should return target unchanged when source has no overlapping keys', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    expect(patchExisting(target, source)).toEqual({ a: 1 });
  });

  it('should return target unchanged when source is empty', () => {
    expect(patchExisting({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it('should overwrite target values with source values for existing keys', () => {
    const target = { a: 'x', b: 'y' };
    const source = { a: 'z' };
    expect(patchExisting(target, source)).toEqual({ a: 'z', b: 'y' });
  });
});

describe('mergeDeepLeft', () => {
  it('should deep merge with left taking priority', () => {
    const left = { a: { b: 1, c: 2 } };
    const right = { a: { b: 3, d: 4 } };
    expect(mergeDeepLeft(left, right)).toEqual({ a: { b: 1, c: 2, d: 4 } });
  });

  it('should return right when left is empty', () => {
    expect(mergeDeepLeft({}, { a: 1 })).toEqual({ a: 1 });
  });

  it('should return left when right is empty', () => {
    expect(mergeDeepLeft({ a: 1 }, {})).toEqual({ a: 1 });
  });
});

describe('mergeDeepRight', () => {
  it('should deep merge with right taking priority', () => {
    const left = { a: { b: 1, c: 2 } };
    const right = { a: { b: 3, d: 4 } };
    expect(mergeDeepRight(left, right)).toEqual({ a: { b: 3, c: 2, d: 4 } });
  });

  it('should return left when right is empty', () => {
    expect(mergeDeepRight({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it('should return right when left is empty', () => {
    expect(mergeDeepRight({}, { a: 1 })).toEqual({ a: 1 });
  });
});

describe('mergeAllIgnoreNil', () => {
  it('should merge objects skipping null values in source', () => {
    expect(mergeAllIgnoreNil({ a: 1 }, { a: null })).toEqual({ a: 1 });
  });

  it('should merge objects skipping undefined values in source', () => {
    expect(mergeAllIgnoreNil({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('should overwrite with non-nil values from source', () => {
    expect(mergeAllIgnoreNil({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('should merge multiple objects preserving non-nil values', () => {
    expect(mergeAllIgnoreNil({ a: 1 }, { a: null }, { c: 3 })).toEqual({ a: 1, c: 3 });
  });

  it('should return empty object when all sources are empty', () => {
    expect(mergeAllIgnoreNil({}, {})).toEqual({});
  });
});
