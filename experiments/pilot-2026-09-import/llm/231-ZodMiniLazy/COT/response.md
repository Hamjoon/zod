**###Test START##**  
```ts
/**
 * Vitest test suite for the `ZodMiniLazy` schema constructor.
 *
 * The `ZodMiniLazy` export is a *constructor* created by `core.$constructor`.
 * It behaves like a Zod schema – i.e. the returned instance contains a
 * `_def` property and inherits the public API of a Zod type (e.g. `parse`,
 * `safeParse`, `optional`, `nullable`, …).  Because the actual implementation
 * of those methods lives in the internal `core` and `_ZodMiniType` modules,
 * the tests focus on the **public contract** that a consumer of `ZodMiniLazy`
 * can rely on:
 *
 * 1. The export is a callable constructor.
 * 2. It accepts a definition object that matches the expected shape.
 * 3. The created instance exposes the standard Zod‑like methods.
 * 4. Edge‑case handling – passing invalid definitions should throw a
 *    descriptive error.
 *
 * The tests are deliberately defensive: they do not depend on the internal
 * implementation details of `core` but only on the observable behaviour of
 * the public API.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniLazy } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper types & mock definitions
// ---------------------------------------------------------------------------

/**
 * A minimal mock definition that satisfies the expected shape for a lazy
 * schema.  In the real library this would be something like:
 *
 *   { lazy: () => ZodSchema }
 *
 * For the purpose of the tests we only need a function that returns a simple
 * Zod schema (e.g. `ZodString`).  Importing the real Zod library would add an
 * unnecessary dependency, so we create a tiny mock that mimics the required
 * interface (`parse` method).
 */
const mockStringSchema = {
  parse: (value: unknown) => {
    if (typeof value !== 'string') {
      throw new Error('Expected string');
    }
    return value;
  },
  safeParse: (value: unknown) => {
    try {
      return { success: true, data: mockStringSchema.parse(value) };
    } catch (err) {
      return { success: false, error: err };
    }
  },
};

/**
 * A valid lazy definition – the `lazy` property is a function that returns a
 * Zod‑compatible schema.
 */
const validLazyDef = {
  lazy: () => mockStringSchema,
};

/**
 * An invalid definition used to test edge‑case handling.
 */
const invalidLazyDef = {
  // Missing the required `lazy` function
  notLazy: 123,
};

// ---------------------------------------------------------------------------
// 1️⃣  Public API extraction (informational – not executed)
// ---------------------------------------------------------------------------
// The public methods that a typical Zod schema provides (and that `ZodMiniLazy`
// inherits from `_ZodMiniType`) are:
//
//   - parse(value: unknown): T
//   - safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }
//   - optional(): ZodOptional<this>
//   - nullable(): ZodNullable<this>
//   - array(): ZodArray<this>
//   - ... (any other methods added by `_ZodMiniType`)
// 
// The test suite below validates a representative subset of these methods.

// ---------------------------------------------------------------------------
// 2️⃣  Basic functionality tests
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – basic construction & core methods', () => {
  it('should be a callable constructor', () => {
    expect(typeof ZodMiniLazy).toBe('function');
  });

  it('should create an instance when given a valid lazy definition', () => {
    const schema = ZodMiniLazy(validLazyDef);
    // The instance should expose a `_def` property (standard Zod convention)
    expect(schema).toHaveProperty('_def');
    // The internal definition should be the one we passed (or a transformed copy)
    expect(schema._def).toMatchObject(validLazyDef);
  });

  it('instance should have a `parse` method that validates using the lazy schema', () => {
    const schema = ZodMiniLazy(validLazyDef);
    expect(typeof schema.parse).toBe('function');

    // Valid string passes
    expect(schema.parse('hello')).toBe('hello');

    // Invalid type throws
    expect(() => schema.parse(123)).toThrowError(/Expected string/);
  });

  it('instance should have a `safeParse` method that returns a result object', () => {
    const schema = ZodMiniLazy(validLazyDef);
    expect(typeof schema.safeParse).toBe('function');

    const success = schema.safeParse('world');
    expect(success).toEqual({ success: true, data: 'world' });

    const failure = schema.safeParse(false);
    expect(failure.success).toBe(false);
    expect(failure.error).toBeInstanceOf(Error);
    expect((failure.error as Error).message).toMatch(/Expected string/);
  });

  it('instance should support chaining methods like `optional` and `nullable`', () => {
    const schema = ZodMiniLazy(validLazyDef);
    // The exact return type is not important for the test – we only verify
    // that the methods exist and return an object that still has `parse`.
    const optionalSchema = schema.optional();
    expect(optionalSchema).toHaveProperty('parse');
    expect(optionalSchema.parse(undefined)).toBeUndefined();

    const nullableSchema = schema.nullable();
    expect(nullableSchema).toHaveProperty('parse');
    expect(nullableSchema.parse(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – edge cases & error handling', () => {
  it('should throw a clear error when constructed with a non‑object definition', () => {
    // @ts-expect-error – intentionally passing wrong type
    expect(() => ZodMiniLazy(null)).toThrowError(/definition must be an object/i);
    // @ts-expect-error – intentionally passing wrong type
    expect(() => ZodMiniLazy(42)).toThrowError(/definition must be an object/i);
  });

  it('should throw when the definition lacks a `lazy` function', () => {
    // @ts-expect-error – intentionally malformed definition
    expect(() => ZodMiniLazy(invalidLazyDef)).toThrowError(/lazy.*function/i);
  });

  it('should throw if the `lazy` property is not a function', () => {
    const badDef = { lazy: 123 as any };
    // @ts-expect-error – intentionally malformed definition
    expect(() => ZodMiniLazy(badDef)).toThrowError(/lazy.*function/i);
  });

  it('should propagate errors thrown inside the lazy resolver', () => {
    const explodingDef = {
      lazy: () => {
        throw new Error('Resolver exploded');
      },
    };
    const schema = ZodMiniLazy(explodingDef);
    expect(() => schema.parse('anything')).toThrowError(/Resolver exploded/);
  });

  it('should handle circular references without infinite recursion (basic sanity check)', () => {
    // Create two lazy schemas that reference each other.
    let schemaA: any;
    let schemaB: any;

    const defA = {
      lazy: () => schemaB,
    };
    const defB = {
      lazy: () => schemaA,
    };

    // Initialise them – the constructor should not eagerly resolve the lazy
    // function, therefore no stack overflow should occur.
    schemaA = ZodMiniLazy(defA);
    schemaB = ZodMiniLazy(defB);

    // Resolve once via `parse` – the lazy resolver will be called only at
    // runtime, not during construction.
    // For the purpose of the test we replace the inner schemas with a simple
    // mock that accepts numbers.
    const numberMock = {
      parse: (v: unknown) => {
        if (typeof v !== 'number') {
          throw new Error('Expected number');
        }
        return v;
      },
      safeParse: (v: unknown) => {
        try {
          return { success: true, data: numberMock.parse(v) };
        } catch (e) {
          return { success: false, error: e };
        }
      },
    };
    // Patch the lazy resolvers after the circular schemas are created.
    (defA.lazy as any) = () => numberMock;
    (defB.lazy as any) = () => numberMock;

    // Both schemas should now behave like the number mock.
    expect(schemaA.parse(10)).toBe(10);
    expect(schemaB.parse(20)).toBe(20);
    expect(() => schemaA.parse('nope')).toThrowError(/Expected number/);
  });
});
```
**###Test END##**