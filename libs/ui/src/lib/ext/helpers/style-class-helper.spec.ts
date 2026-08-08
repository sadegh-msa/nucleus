import { describe, expect, it } from 'vitest';
import { uniquifyStyleClass } from './style-class-helper';

describe('uniquifyStyleClass', () => {
  it('should return a single class unchanged', () => {
    expect(uniquifyStyleClass('foo')).toBe('foo');
  });

  it('should join multiple classes with spaces', () => {
    expect(uniquifyStyleClass('foo', 'bar')).toBe('foo bar');
  });

  it('should remove duplicate classes', () => {
    expect(uniquifyStyleClass('foo', 'bar', 'foo')).toBe('foo bar');
  });

  it('should trim whitespace around classes', () => {
    expect(uniquifyStyleClass(' foo ', '  bar  ')).toBe('foo bar');
  });

  it('should collapse multiple spaces between classes', () => {
    expect(uniquifyStyleClass('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle empty strings', () => {
    expect(uniquifyStyleClass('foo', '', 'bar')).toBe('foo bar');
  });

  it('should return empty string when all inputs are empty', () => {
    expect(uniquifyStyleClass('', '')).toBe('');
  });
});
