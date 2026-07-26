import { describe, expect, it } from 'vitest';
import { applyMixins } from './apply-mixins-util';

describe('applyMixins', () => {
  it('should copy methods from base constructors to derived', () => {
    class Base {
      greet() {
        return 'hello';
      }
    }

    class Derived {}

    applyMixins(Derived, [Base]);

    const instance = new Derived();
    expect(instance).toHaveProperty('greet');
    expect((instance as any).greet()).toBe('hello');
  });

  it('should copy methods from multiple base constructors', () => {
    class A {
      a() {
        return 'a';
      }
    }

    class B {
      b() {
        return 'b';
      }
    }

    class Derived {}

    applyMixins(Derived, [A, B]);

    const instance = new Derived();
    expect((instance as any).a()).toBe('a');
    expect((instance as any).b()).toBe('b');
  });

  it('should not fail with empty constructors array', () => {
    class Derived {}
    applyMixins(Derived, []);
    const instance = new Derived();
    expect(instance).toBeDefined();
  });
});
