import { describe, expect, it } from 'vitest';
import { deepSet, mergeAll, mergeAllIgnoreNil, mergeDeepLeft, mergeDeepRight, patchExisting } from './object-util';

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
