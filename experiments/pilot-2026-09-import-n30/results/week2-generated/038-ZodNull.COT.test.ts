/**
 * Vitest test suite for the `ZodNull` schema.
 *
 * The `ZodNull` export is a constructor created by the internal Zod core.
 * It behaves like any other Zod schema and therefore exposes the public
 * API defined on `ZodType`.  The most important methods for a null‑only
 * schema are:
 *
 *  - `parse(value)`: returns the value if it is `null`, otherwise throws a `ZodError`.
 *  - `safeParse(value)`: returns `{ success: true, data: null }` for `null`,
 *    otherwise `{ success: false, error: ZodError }`.
 *  - `optional()`: creates a new schema that also accepts `undefined`.
 *  - `nullable()`: (a no‑op for `ZodNull` – it returns the same schema).
 *  - `default(value)`: supplies a default value when the input is `undefined`.
 *
 * The test file below:
 *   1. Lists the public methods we are exercising.
 *   2. Provides a basic test for each method.
 *   3. Adds edge‑case tests (different primitive types, objects, symbols, etc.).
 *   4. Verifies that error handling works as expected.
 */

import { describe, it, expect } from 'vitest';
import { ZodNull } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public methods (signatures) we are testing
// ---------------------------------------------------------------------------
// ZodNull.parse(value: unknown): null
// ZodNull.safeParse(value: unknown): { success: true; data: null } | { success: false; error: ZodError }
// ZodNull.optional(): ZodOptional<ZodNull>
// ZodNull.nullable(): ZodNull               // returns itself – no change
// ZodNull.default(def: null): ZodDefault<ZodNull>
// ---------------------------------------------------------------------------

describe('ZodNull schema', () => {
  // -----------------------------------------------------------------------
  // 2️⃣  Basic functionality tests
  // -----------------------------------------------------------------------
  it('should successfully parse `null`', () => {
    const schema = ZodNull();
    expect(schema.parse(null)).toBeNull();
  });

  it('should throw a ZodError when parsing non‑null values (basic types)', () => {
    const schema = ZodNull();
    const badValues = [undefined, 0, 1, '', 'text', true, false, {}, [], Symbol('sym'), BigInt(10)];
    for (const val of badValues) {
      expect(() => schema.parse(val as any)).toThrowError(); // ZodError is thrown
    }
  });

  it('safeParse should succeed for `null` and fail for everything else', () => {
    const schema = ZodNull();

    // success case
    const success = schema.safeParse(null);
    expect(success.success).toBe(true);
    if (success.success) {
      expect(success.data).toBeNull();
    }

    // failure cases
    const failValues = [undefined, 42, 'null', {}, [], () => {}];
    for (const val of failValues) {
      const result = schema.safeParse(val as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        // The error should be an instance of ZodError (type‑guarded by `error` property)
        expect(result.error).toBeDefined();
        // The error message should contain the word "null"
        expect(result.error.message).toContain('null');
      }
    }
  });

  // -----------------------------------------------------------------------
  // 3️⃣  Optional schema tests
  // -----------------------------------------------------------------------
  it('optional() should accept `undefined` in addition to `null`', () => {
    const optionalSchema = ZodNull().optional();

    // `null` still works
    expect(optionalSchema.parse(null)).toBeNull();

    // `undefined` is now accepted
    expect(optionalSchema.parse(undefined)).toBeUndefined();

    // any other value should still be rejected
    expect(() => optionalSchema.parse(0 as any)).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 4️⃣  Nullable schema tests (no‑op for ZodNull)
  // -----------------------------------------------------------------------
  it('nullable() should return the same schema instance (no‑op)', () => {
    const schema = ZodNull();
    const nullableSchema = schema.nullable();

    // The returned schema should behave identically
    expect(nullableSchema.parse(null)).toBeNull();
    expect(() => nullableSchema.parse('not null' as any)).toThrowError();

    // In practice Zod returns the same reference for ZodNull.nullable()
    // (this is an implementation detail, but we can assert equality)
    expect(nullableSchema).toBe(schema);
  });

  // -----------------------------------------------------------------------
  // 5️⃣  Default value tests
  // -----------------------------------------------------------------------
  it('default() should supply a default when input is `undefined`', () => {
    const schemaWithDefault = ZodNull().default(null); // default is also null (trivial but valid)

    // When value is provided, it is returned unchanged
    expect(schemaWithDefault.parse(null)).toBeNull();

    // When value is omitted (i.e., undefined), the default is used
    expect(schemaWithDefault.parse(undefined)).toBeNull();
  });

  // -----------------------------------------------------------------------
  // 6️⃣  Edge‑case / exception handling tests
  // -----------------------------------------------------------------------
  it('should reject objects that masquerade as null (e.g., Object.create(null))', () => {
    const schema = ZodNull();
    const weirdNull = Object.create(null); // not strictly `null`
    expect(() => schema.parse(weirdNull as any)).toThrowError();
  });

  it('should reject NaN (even though it is a number) and Infinity', () => {
    const schema = ZodNull();
    expect(() => schema.parse(NaN as any)).toThrowError();
    expect(() => schema.parse(Infinity as any)).toThrowError();
  });

  it('should reject functions and class instances', () => {
    const schema = ZodNull();
    class Dummy {}
    const fn = () => {};
    const instance = new Dummy();

    expect(() => schema.parse(fn as any)).toThrowError();
    expect(() => schema.parse(instance as any)).toThrowError();
  });
});
