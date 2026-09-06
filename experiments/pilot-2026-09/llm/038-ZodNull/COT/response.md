**###Test START##**  
```ts
/**
 * Vitest test suite for the `ZodNull` schema.
 *
 * The `ZodNull` export is a constructor created by the internal `core.$constructor`
 * helper. In the public Zod API this behaves like the other Zod schema classes
 * (e.g. `ZodString`, `ZodNumber`, …) and therefore provides the standard
 * schema methods such as `parse`, `safeParse`, `optional`, `nullable`,
 * `default`, etc.
 *
 * The tests below:
 *   1. List the public methods that are expected on a Zod schema instance.
 *   2. Verify the basic behaviour of each method.
 *   3. Cover edge‑cases and error handling (wrong input types, special values,
 *      etc.).
 *
 * If the internal implementation of `ZodNull` changes, the tests will still
 * serve as a contract for the public API.
 */

import { describe, it, expect } from 'vitest';
import { ZodNull } from './ZodNull'; // Adjust the import path if necessary

/**
 * ---------------------------------------------------------------------------
 * 1️⃣  Public methods (signatures) that a Zod schema instance provides.
 * ---------------------------------------------------------------------------
 *
 * The following methods are part of the public Zod API and are therefore
 * expected to exist on the object returned by `ZodNull.create()` (or the
 * constructor call itself, depending on the library version):
 *
 *   - parse(value: unknown): null
 *   - safeParse(value: unknown): { success: true; data: null } | { success: false; error: ZodError }
 *   - optional(): ZodOptional<ZodNull>
 *   - nullable(): ZodNullable<ZodNull>
 *   - default(def: null): ZodDefault<ZodNull>
 *   - catch(def: null): ZodCatch<ZodNull>
 *   - transform<Out>(cb: (val: null) => Out): ZodEffects<ZodNull, Out>
 *   - refine(cb: (val: null) => boolean, message?: string): this
 *   - describe(text: string): this
 *
 * Not every method is exercised in the minimal test suite, but the most
 * commonly used ones (`parse`, `safeParse`, `optional`, `nullable`) are fully
 * covered, together with a few edge‑case scenarios.
 */

/**
 * ---------------------------------------------------------------------------
 * 2️⃣  Basic functionality tests
 * ---------------------------------------------------------------------------
 */
describe('ZodNull – basic functionality', () => {
  // The ZodNull schema instance. In the real Zod library this is obtained via
  // `ZodNull.create()`. The exported `ZodNull` constant works as a constructor,
  // so we can call it directly.
  const schema = ZodNull.create ? ZodNull.create() : new (ZodNull as any)();

  it('should have the expected public methods', () => {
    const expectedMethods = [
      'parse',
      'safeParse',
      'optional',
      'nullable',
      'default',
      'catch',
      'transform',
      'refine',
      'describe',
    ];
    expectedMethods.forEach((method) => {
      expect(typeof (schema as any)[method]).toBe('function');
    });
  });

  it('parse(null) should return null', () => {
    expect(schema.parse(null)).toBeNull();
  });

  it('parse(non‑null) should throw a ZodError', () => {
    const invalidValues = [
      undefined,
      0,
      1,
      '',
      'string',
      true,
      false,
      {},
      { a: 1 },
      [],
      [null],
      Symbol('sym'),
      BigInt(10),
    ];

    invalidValues.forEach((val) => {
      expect(() => schema.parse(val)).toThrowError(); // ZodError is an Error subclass
    });
  });

  it('safeParse(null) should succeed', () => {
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeNull();
    }
  });

  it('safeParse(non‑null) should fail', () => {
    const result = schema.safeParse('not null');
    expect(result.success).toBe(false);
    if (!result.success) {
      // The error object should be an instance of ZodError (or at least have an `issues` array)
      expect(result.error).toBeDefined();
      // @ts-ignore – we only care that the shape exists
      expect(Array.isArray(result.error.issues)).toBe(true);
    }
  });
});

/**
 * ---------------------------------------------------------------------------
 * 3️⃣  Edge‑case & exception handling tests
 * ---------------------------------------------------------------------------
 *
 * These tests focus on values that are often sources of bugs:
 *   - `undefined` (different from `null`)
 *   - Objects that masquerade as `null` (e.g., `Object.create(null)`)
 *   - Primitive wrappers (`new String(null)`, etc.)
 *   - Symbol and BigInt values
 */
describe('ZodNull – edge cases & error handling', () => {
  const schema = ZodNull.create ? ZodNull.create() : new (ZodNull as any)();

  it('should reject undefined (even though it is falsy)', () => {
    expect(() => schema.parse(undefined)).toThrowError();
    expect(schema.safeParse(undefined).success).toBe(false);
  });

  it('should reject objects that have a null prototype', () => {
    const obj = Object.create(null);
    expect(() => schema.parse(obj)).toThrowError();
    expect(schema.safeParse(obj).success).toBe(false);
  });

  it('should reject primitive wrapper objects (e.g., new String(null))', () => {
    const wrapper = new String(null) as unknown as null;
    expect(() => schema.parse(wrapper)).toThrowError();
    expect(schema.safeParse(wrapper).success).toBe(false);
  });

  it('should reject Symbol values', () => {
    const sym = Symbol('null');
    expect(() => schema.parse(sym)).toThrowError();
    expect(schema.safeParse(sym).success).toBe(false);
  });

  it('should reject BigInt values', () => {
    const big = BigInt(0) as unknown as null;
    expect(() => schema.parse(big)).toThrowError();
    expect(schema.safeParse(big).success).toBe(false);
  });
});

/**
 * ---------------------------------------------------------------------------
 * 4️⃣  Tests for derived schemas (`optional`, `nullable`, `default`)
 * ---------------------------------------------------------------------------
 *
 * These methods return new schema instances that extend the original `ZodNull`
 * behaviour. We verify that they correctly accept the additional values while
 * still rejecting everything else.
 */
describe('ZodNull – derived schemas', () => {
  const base = ZodNull.create ? ZodNull.create() : new (ZodNull as any)();

  it('optional() should accept undefined and null', () => {
    const opt = base.optional();

    // undefined is now valid
    expect(opt.parse(undefined)).toBeUndefined();
    // null remains valid
    expect(opt.parse(null)).toBeNull();

    // other values still throw
    expect(() => opt.parse(0)).toThrowError();
    expect(() => opt.parse('')).toThrowError();
  });

  it('nullable() should behave identically to the base schema (null only)', () => {
    const nul = base.nullable();

    // null is still valid
    expect(nul.parse(null)).toBeNull();

    // undefined is NOT accepted (nullable does NOT add undefined)
    expect(() => nul.parse(undefined)).toThrowError();

    // other values still throw
    expect(() => nul.parse(42)).toThrowError();
  });

  it('default(null) should return null when input is undefined', () => {
    // The `default` method expects a default value; for a null schema the only
    // sensible default is `null` itself.
    const def = (base as any).default(null);

    // When the input is undefined, the default is applied.
    expect(def.parse(undefined)).toBeNull();

    // When the input is null, the original value is kept.
    expect(def.parse(null)).toBeNull();

    // Any other value should still be rejected.
    expect(() => def.parse('oops')).toThrowError();
  });
});

/**
 * ---------------------------------------------------------------------------
 * 5️⃣  Additional sanity checks (method chaining & description)
 * ---------------------------------------------------------------------------
 */
describe('ZodNull – method chaining & description', () => {
  const base = ZodNull.create ? ZodNull.create() : new (ZodNull as any)();

  it('refine can be chained and still validates null', () => {
    const refined = base.refine((val) => val === null, 'must be null');
    expect(refined.parse(null)).toBeNull();
    // The refine callback will never be called with a non‑null because the
    // underlying schema already rejects those values.
    expect(() => refined.parse(123)).toThrowError();
  });

  it('describe adds a description without breaking validation', () => {
    const described = base.describe('A schema that only accepts null');
    // The description is stored on the schema; we can inspect it via the
    // internal `_def` property (which exists on all Zod schemas).
    // @ts-ignore – internal property access for testing purposes
    expect(described._def.description).toBe('A schema that only accepts null');

    // Validation still works
    expect(described.parse(null)).toBeNull();
    expect(() => described.parse('no')).toThrowError();
  });
});
```
**###Test END##**