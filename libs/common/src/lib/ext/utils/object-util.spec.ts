import { describe, expect, it } from 'vitest';
import { deepSet, mergeObjects } from './object-util';

describe('mergeObjects', () => {
  it('should merge two objects with b taking priority', () => {
    const a = { x: 1, y: 2 };
    const b = { y: 3, z: 4 };
    expect(mergeObjects(a, b)).toEqual({ x: 1, y: 3, z: 4 });
  });

  it('should return a when b is empty', () => {
    expect(mergeObjects({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it('should return b when a is empty', () => {
    expect(mergeObjects({}, { b: 2 })).toEqual({ b: 2 });
  });

  it('should keep a value when b value is null', () => {
    expect(mergeObjects({ a: 1 }, { a: null })).toEqual({ a: 1 });
  });

  it('should keep a value when b value is undefined', () => {
    expect(mergeObjects({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('should overwrite with b value when b value is 0', () => {
    expect(mergeObjects({ a: 1 }, { a: 0 })).toEqual({ a: 0 });
  });

  it('should overwrite with b value when b value is empty string', () => {
    expect(mergeObjects({ a: 'x' }, { a: '' })).toEqual({ a: '' });
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
