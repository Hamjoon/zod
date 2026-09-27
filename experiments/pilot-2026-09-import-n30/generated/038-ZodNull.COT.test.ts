/**
 * Vitest test suite for the `ZodNull` schema exported from `./schemas.js`.
 *
 * The `ZodNull` schema is a Zod type that validates the literal `null` value.
 * It inherits the public API of a regular Zod schema (e.g. `parse`, `safeParse`,
 * `optional`, `nullable`, `default`, etc.).  The tests below:
 *
 * 1. List the public methods we expect to be available on a Zod schema.
 * 2. Provide a basic test for each method to verify its normal behaviour.
 * 3. Identify edge‑case / error‑handling scenarios (wrong input types,
 *    interaction with modifiers like `optional` and `default`, etc.).
 * 4. Add dedicated tests for those edge cases.
 *
 * The test file is completely self‑contained and can be run with Vitest
 * (`vitest run ZodNull.test.ts`).
 */

import { describe, expect, it } from 'vitest';
import { ZodNull } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public methods we expect on a Zod schema (including those inherited
//     from ZodType).  The exact list may evolve with Zod versions, but the
//     most common ones are listed here.
//
//   - parse(value: unknown): T
//   - safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }
//   - refine(check: (val: T) => boolean, message?: string): this
//   - transform<Out>(fn: (val: T) => Out): ZodSchema<Out>
//   - optional(): ZodOptional<this>
//   - nullable(): ZodNullable<this>
//   - default(def: T): ZodDefault<this>
//   - catch(def: T): ZodCatch<this>
//   - describe(description: string): this
//   - array(): ZodArray<this>
//   - brand<B extends string>(brand: B): ZodBranded<this, B>
//   - and(...schemas: ZodSchema<any>[]): ZodIntersection<this, any>
//   - or(...schemas: ZodSchema<any>[]): ZodUnion<this, any>
//
// For the purpose of this test suite we will focus on the methods that are
// guaranteed to exist on every Zod schema: `parse`, `safeParse`, `optional`,
// `nullable`, `default`, and `describe`.  The remaining methods are part of
// Zod's fluent API and are exercised indirectly via the modifiers above.
// ---------------------------------------------------------------------------

describe('ZodNull – basic functionality', () => {
  // -----------------------------------------------------------------------
  // 2️⃣  Basic test cases for the core methods
  // -----------------------------------------------------------------------
  it('should parse the literal `null` correctly', () => {
    const result = ZodNull.parse(null);
    expect(result).toBeNull();
  });

  it('should throw when parsing a non‑null value (parse)', () => {
    const badValues = [undefined, 0, '', {}, [], true, false, 'null'];
    for (const val of badValues) {
      expect(() => ZodNull.parse(val as any)).toThrowError();
    }
  });

  it('should safely parse a valid null value', () => {
    const safe = ZodNull.safeParse(null);
    expect(safe.success).toBe(true);
    if (safe.success) {
      expect(safe.data).toBeNull();
    }
  });

  it('should safely parse an invalid value and return an error object', () => {
    const safe = ZodNull.safeParse('not null' as any);
    expect(safe.success).toBe(false);
    if (!safe.success) {
      // The error should contain at least one issue describing the mismatch.
      expect(safe.error.issues.length).toBeGreaterThan(0);
      const issue = safe.error.issues[0];
      expect(issue.message).toContain('null');
    }
  });

  // -----------------------------------------------------------------------
  // 3️⃣  Modifier methods – optional, nullable, default, describe
  // -----------------------------------------------------------------------
  it('optional() should allow undefined in addition to null', () => {
    const schema = ZodNull.optional();
    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse(null)).toBeNull();
    expect(() => schema.parse(123 as any)).toThrowError();
  });

  it('nullable() should still only accept null (no change)', () => {
    const schema = ZodNull.nullable();
    expect(schema.parse(null)).toBeNull();
    expect(() => schema.parse(undefined as any)).toThrowError();
    expect(() => schema.parse('string' as any)).toThrowError();
  });

  it('default() should replace undefined with the provided default (null)', () => {
    const schema = ZodNull.default(null);
    // When the input is undefined, the default value (null) is returned.
    expect(schema.parse(undefined)).toBeNull();
    // When the input is a valid null, it is returned unchanged.
    expect(schema.parse(null)).toBeNull();
    // Invalid values still throw.
    expect(() => schema.parse(0 as any)).toThrowError();
  });

  it('describe() should attach a description that can be retrieved via .description', () => {
    const description = 'A schema that only accepts null';
    const schema = ZodNull.describe(description);
    // Zod exposes the description via the internal `_def` property.
    // Accessing it directly is acceptable in a test environment.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((schema as any)._def.description).toBe(description);
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------

describe('ZodNull – edge cases & error handling', () => {
  // Edge case: parsing `NaN` (a number that is not equal to itself)
  it('should reject NaN as a non‑null value', () => {
    expect(() => ZodNull.parse(NaN as any)).toThrowError();
  });

  // Edge case: parsing a Symbol
  it('should reject Symbol values', () => {
    const sym = Symbol('test');
    expect(() => ZodNull.parse(sym as any)).toThrowError();
  });

  // Edge case: parsing a BigInt
  it('should reject BigInt values', () => {
    expect(() => ZodNull.parse(BigInt(10) as any)).toThrowError();
  });

  // Edge case: using `refine` to add a custom validation that always passes.
  // This ensures the fluent API does not break the underlying null check.
  it('refine should not affect the null validation when the predicate returns true', () => {
    const schema = ZodNull.refine(() => true, { message: 'should never fail' });
    expect(schema.parse(null)).toBeNull();
  });

  // Edge case: using `refine` with a predicate that fails for null.
  // The custom error message should be propagated.
  it('refine should surface custom error messages on failure', () => {
    const schema = ZodNull.refine(() => false, { message: 'custom null error' });
    expect(() => schema.parse(null)).toThrowError(/custom null error/);
  });

  // Edge case: chaining modifiers – optional().default(null)
  // The combination should still accept undefined (via optional) and replace it
  // with the default value.
  it('optional().default(null) should treat undefined as the default null', () => {
    const schema = ZodNull.optional().default(null);
    expect(schema.parse(undefined)).toBeNull(); // default applied
    expect(schema.parse(null)).toBeNull(); // explicit null
  });

  // Edge case: chaining modifiers – nullable().optional()
  // The order should not matter; the resulting schema should accept both null
  // and undefined.
  it('nullable().optional() should accept both null and undefined', () => {
    const schema = ZodNull.nullable().optional();
    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse(null)).toBeNull();
  });

  // Edge case: calling `parse` with an object that has a custom `valueOf`
  // that returns null – Zod should treat the raw value, not the coerced one.
  it('should not coerce objects with custom valueOf to null', () => {
    const obj = {
      valueOf() {
        return null;
      },
    };
    expect(() => ZodNull.parse(obj as any)).toThrowError();
  });
});
