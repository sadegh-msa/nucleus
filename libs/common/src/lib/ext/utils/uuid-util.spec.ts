import { describe, expect, it } from 'vitest';
import { isUUID } from './uuid-util';

describe('isUUID', () => {
  it('should return true for a valid UUID v4', () => {
    expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should return true for another valid UUID', () => {
    expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
  });

  it('should return false for a string with wrong length', () => {
    expect(isUUID('not-a-uuid')).toBe(false);
  });

  it('should return false for a valid-length string with invalid chars', () => {
    expect(isUUID('550e8400-e29b-41d4-a716-44665544000z')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isUUID('')).toBe(false);
  });

  it('should return false for a UUID without dashes', () => {
    expect(isUUID('550e8400e29b41d4a716446655440000')).toBe(false);
  });
});
