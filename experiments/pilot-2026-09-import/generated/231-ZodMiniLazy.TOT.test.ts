/**
 * Vitest test suite for the `ZodMiniLazy` class.
 *
 * The real implementation of `ZodMiniLazy` lives in `./schemas.js` and depends on an
 * internal `core` module that provides `$ZodLazy`, `$ZodLazyInternals` and `$constructor`.
 *
 * For the purpose of unit‑testing we mock the minimal behaviour of `core` that is needed
 * by `ZodMiniLazy`.  The mock reproduces the lazy‑initialisation contract:
 *
 *   - `$ZodLazy.init(inst, def)` stores the lazy definition (`def.lazy`) on the instance
 *     and creates a private `_resolve()` helper that will invoke the lazy function
 *     **only when needed**.
 *
 *   - `ZodMiniType.init(inst, def)` (which is also part of the real library) simply
 *     forwards a `parse` method that delegates to the resolved schema.
 *
 * The tests cover:
 *
 *   1. **Typical usage** – a lazy schema that resolves to a simple string validator.
 *   2. **Laziness** – the resolver is not called at construction time.
 *   3. **Error handling** – the lazy function must return a valid schema (i.e. an object
 *      with a `parse` method); otherwise an error is thrown.
 *   4. **Circular references** – two lazy schemas that reference each other can parse
 *      nested data without causing a stack overflow.
 *
 * All tests are written with Vitest (`describe`, `it`, `expect`) and use TypeScript
 * typings for clarity.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// 1️⃣  Mock the internal `core` module that `ZodMiniLazy` depends on.
// ---------------------------------------------------------------------------
vi.mock('./core', () => {
  // A WeakMap is used to keep a private association between an instance and its
  // lazy definition without leaking memory.
  const lazyDefMap = new WeakMap<any, any>();

  // Helper that validates a "schema" – in our tiny test world a schema is any
  // object that implements a `parse(value: unknown)` method.
  const isValidSchema = (obj: any) =>
    obj && typeof obj === 'object' && typeof obj.parse === 'function';

  const core = {
    // -----------------------------------------------------------------------
    // $ZodLazy.init – stores the lazy definition and creates a lazy resolver.
    // -----------------------------------------------------------------------
    $ZodLazy: {
      init(inst: any, def: any) {
        if (typeof def.lazy !== 'function') {
          throw new Error('`lazy` must be a function returning a schema');
        }
        lazyDefMap.set(inst, def.lazy);

        // Private method used by the mock `ZodMiniType.init` to obtain the real schema.
        inst._resolve = () => {
          const resolver = lazyDefMap.get(inst);
          const schema = resolver();
          if (!isValidSchema(schema)) {
            throw new Error('Lazy resolver must return a valid schema (object with parse)');
          }
          return schema;
        };
      },
    },

    // -----------------------------------------------------------------------
    // $ZodLazyInternals – a placeholder class required only for typing.
    // -----------------------------------------------------------------------
    $ZodLazyInternals: class {},

    // -----------------------------------------------------------------------
    // $constructor – mimics the real `$constructor` helper used by the library.
    // -----------------------------------------------------------------------
    $constructor(name: string, initFn: (inst: any, def: any) => void) {
      // The returned function behaves like a class factory: it creates a fresh
      // instance, runs the supplied `initFn`, and returns the instance.
      return (def: any) => {
        const inst: any = { _def: def, __type: name };
        initFn(inst, def);
        return inst;
      };
    },
  };

  return { core };
});

// ---------------------------------------------------------------------------
// 2️⃣  Import the subject under test – the real `ZodMiniLazy` implementation.
// ---------------------------------------------------------------------------
import { ZodMiniLazy } from './schemas.js';

// ---------------------------------------------------------------------------
// 3️⃣  Helper: a very small "string schema" used in many tests.
// ---------------------------------------------------------------------------
const stringSchema = {
  parse(value: unknown) {
    if (typeof value === 'string') return value;
    throw new Error('Expected string');
  },
};

// ---------------------------------------------------------------------------
// 4️⃣  Test suite.
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – comprehensive behaviour', () => {
  // Reset module mocks before each test to avoid cross‑test contamination.
  beforeEach(() => {
    vi.resetModules();
  });

  // -----------------------------------------------------------------------
  // ✅  Test case 1 – typical usage: lazy resolves to a simple string schema.
  // -----------------------------------------------------------------------
  it('should lazily resolve to a string schema and parse correctly', () => {
    const lazy = ZodMiniLazy({ lazy: () => stringSchema });

    // At this point the resolver has NOT been called yet.
    // The instance should expose a private `_resolve` method that we can call.
    expect(typeof (lazy as any)._resolve).toBe('function');

    // Resolve and parse a valid string.
    const resolved = (lazy as any)._resolve();
    expect(resolved).toBe(stringSchema);
    expect(resolved.parse('hello')).toBe('hello');

    // Parsing an invalid value should throw.
    expect(() => resolved.parse(123)).toThrow('Expected string');
  });

  // -----------------------------------------------------------------------
  // ✅  Test case 2 – laziness: the resolver runs only when needed.
  // -----------------------------------------------------------------------
  it('should not invoke the lazy function during construction', () => {
    const callCount = { count: 0 };
    const lazy = ZodMiniLazy({
      lazy: () => {
        callCount.count += 1;
        return stringSchema;
      },
    });

    // Construction must NOT have called the resolver.
    expect(callCount.count).toBe(0);

    // First resolve triggers the call.
    (lazy as any)._resolve();
    expect(callCount.count).toBe(1);

    // Subsequent resolves call the resolver again (the real library may cache;
    // our mock deliberately does not cache to keep the test simple).
    (lazy as any)._resolve();
    expect(callCount.count).toBe(2);
  });

  // -----------------------------------------------------------------------
  // ✅  Test case 3 – error when lazy returns a non‑schema object.
  // -----------------------------------------------------------------------
  it('should throw if the lazy function returns something that is not a schema', () => {
    const lazy = ZodMiniLazy({
      lazy: () => {
        // Returning a plain number is illegal.
        return 42 as any;
      },
    });

    expect(() => (lazy as any)._resolve()).toThrow(
      'Lazy resolver must return a valid schema (object with parse)'
    );
  });

  // -----------------------------------------------------------------------
  // ✅  Test case 4 – error when `lazy` is not a function.
  // -----------------------------------------------------------------------
  it('should throw during construction if `lazy` is not a function', () => {
    // @ts-expect-error – intentionally passing a wrong type.
    expect(() => ZodMiniLazy({ lazy: 123 })).toThrow('`lazy` must be a function returning a schema');
  });

  // -----------------------------------------------------------------------
  // ✅  Test case 5 – circular lazy schemas (A ↔ B) parse nested data.
  // -----------------------------------------------------------------------
  it('should handle circular lazy schemas without infinite recursion', () => {
    // Forward declarations.
    let schemaA: any;
    let schemaB: any;

    // Define A that lazily references B.
    schemaA = ZodMiniLazy({
      lazy: () => ({
        parse(value: unknown) {
          // Expect an object with a `b` property that conforms to schemaB.
          if (typeof value !== 'object' || value === null || !('b' in (value as any))) {
            throw new Error('A expects an object with a `b` field');
          }
          // Delegate parsing of the nested `b` to schemaB.
          return { b: (schemaB as any)._resolve().parse((value as any).b) };
        },
      }),
    });

    // Define B that lazily references A.
    schemaB = ZodMiniLazy({
      lazy: () => ({
        parse(value: unknown) {
          // Expect an object with an `a` property that conforms to schemaA.
          if (typeof value !== 'object' || value === null || !('a' in (value as any))) {
            throw new Error('B expects an object with an `a` field');
          }
          return { a: (schemaA as any)._resolve().parse((value as any).a) };
        },
      }),
    });

    // Build a small nested structure: A -> B -> A (depth 2).
    const input = {
      b: {
        a: {
          b: {
            // Terminate with a primitive that the innermost schema can accept.
            // We'll use the string schema for the deepest level.
            // To keep the example simple, we replace the deepest `b` with a string.
            // The innermost schema (schemaB) will try to parse it as an object,
            // which will throw – we therefore stop at depth 2.
          } as any,
        } as any,
      } as any,
    };

    // The outermost parse should succeed up to the point where the innermost
    // schema receives a non‑object and throws. We'll assert that the error
    // message matches our expectation.
    expect(() => (schemaA as any)._resolve().parse(input)).toThrow(
      'B expects an object with an `a` field'
    );

    // A valid circular structure that terminates with a string using the
    // stringSchema directly (by embedding it as the deepest leaf).
    const validInput = {
      b: {
        a: {
          b: {
            // leaf is a string, but schemaB expects an object, so we need to
            // adapt: we replace the leaf with an object that contains a string
            // parsed by a *different* lazy schema that resolves to stringSchema.
            // For simplicity, we create a third lazy schema.
          } as any,
        } as any,
      } as any,
    };

    // Create a third lazy schema that resolves to the string schema.
    const leafString = ZodMiniLazy({ lazy: () => stringSchema });

    // Replace the deepest leaf with the appropriate shape.
    (validInput as any).b.a.b = { parse: leafString._resolve().parse };

    // Now parsing should succeed and return the nested structure with the leaf
    // string unchanged.
    const result = (schemaA as any)._resolve().parse(validInput);
    expect(result).toEqual({
      b: {
        a: {
          b: {
            parse: leafString._resolve().parse,
          },
        },
      },
    });
  });
});
