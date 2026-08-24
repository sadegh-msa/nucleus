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

  it('should let later mixins override methods of earlier ones', () => {
    class First {
      shared() {
        return 'first';
      }
    }

    class Second {
      shared() {
        return 'second';
      }
    }

    class Derived {}

    applyMixins(Derived, [First, Second]);

    const instance = new Derived() as any;
    expect(instance.shared()).toBe('second');
  });

  it('should copy accessor descriptors with their semantics', () => {
    class WithAccessor {
      get value() {
        return 'getter-result';
      }

      set value(v: string) {
        (this as any).stored = v;
      }
    }

    class Derived {}

    applyMixins(Derived, [WithAccessor]);

    const descriptor = Object.getOwnPropertyDescriptor(Derived.prototype, 'value');
    expect(typeof descriptor?.get).toBe('function');
    expect(typeof descriptor?.set).toBe('function');

    const instance = new Derived() as any;
    expect(instance.value).toBe('getter-result');
    instance.value = 'x';
    expect(instance.stored).toBe('x');
  });

  it('should not copy base constructor instance fields', () => {
    class WithField {
      field = 'set-by-base-constructor';
    }

    class Derived {}

    applyMixins(Derived, [WithField]);

    expect(new Derived()).not.toHaveProperty('field');
  });

  it('should replace the derived constructor with the last base constructor', () => {
    class Base {
      baseMethod() {
        return 'base';
      }
    }

    class Derived {}

    applyMixins(Derived, [Base]);

    expect(Derived.prototype.constructor).toBe(Base.prototype.constructor);
  });
});
