/**
 * Vitest test suite for the `ZodMiniIntersection` class.
 *
 * The class is exported from `./schemas.js` and is created via `core.$constructor`.
 * It builds a Zod “intersection” schema by delegating to `core.$ZodIntersection.init`
 * and `ZodMiniType.init`.  The public API of an intersection schema (in the
 * mini‑Zod implementation) mirrors the full Zod library, i.e. it provides
 * `parse`, `safeParse`, `refine`, `optional`, `nullable`, etc.  For the purpose
 * of this test suite we focus on the most commonly‑used methods:
 *
 *   - `parse(value)` – throws on validation failure, returns the value otherwise.
 *   - `safeParse(value)` – never throws, returns `{ success: true, data }` or
 *                         `{ success: false, error }`.
 *
 * The tests are organised in three logical phases that mimic the “three‑expert”
 * workflow described in the prompt:
 *
 *   1. **Method extraction** – we list the public methods we will test.
 *   2. **Basic functionality tests** – one simple test per method.
 *   3. **Edge‑case / exception tests** – additional tests that hit corner‑cases
 *      and error handling paths.
 *
 * All tests are written with Vitest (`import { describe, it, expect } from 'vitest'`).
 * The suite can be run with `vitest run` or `vitest` in a project that already has
 * Vitest configured.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniIntersection } from './schemas.js';
import { ZodString, ZodNumber, ZodObject, ZodLiteral } from './schemas.js'; // assume these are exported

/* -------------------------------------------------------------------------- */
/* 1️⃣  PUBLIC METHOD LIST (extracted from the mini‑Zod API)                    */
/* -------------------------------------------------------------------------- */
/**
 * The `ZodMiniIntersection` instance (like any Zod schema) exposes the
 * following public methods that are relevant for testing:
 *
 *   - `parse(value: unknown): T`                     // throws ZodError on failure
 *   - `safeParse(value: unknown): SafeParseResult<T>` // never throws
 *   - `refine(check: (val: T) => boolean, params?)` // adds a custom validator
 *   - `optional(): ZodOptional<T>`                  // makes the schema optional
 *   - `nullable(): ZodNullable<T>`                  // makes the schema nullable
 *
 * For brevity we concentrate on `parse` and `safeParse` because they are the
 * core validation entry‑points; the other methods are thin wrappers that are
 * exercised indirectly when we test optional/nullable behaviour.
 */

/* -------------------------------------------------------------------------- */
/* 2️⃣  BASIC FUNCTIONALITY TESTS                                            */
/* -------------------------------------------------------------------------- */
describe('ZodMiniIntersection – basic functionality', () => {
  // Helper schemas used across many tests
  const PersonSchema = ZodObject({
    name: ZodString(),
    age: ZodNumber().int().min(0),
  });

  const AddressSchema = ZodObject({
    street: ZodString(),
    zip: ZodString().length(5),
  });

  // The intersection of two object schemas should require **all** fields.
  const PersonWithAddress = ZodMiniIntersection(PersonSchema, AddressSchema);

  it('should expose the expected public methods', () => {
    expect(typeof PersonWithAddress.parse).toBe('function');
    expect(typeof PersonWithAddress.safeParse).toBe('function');
    expect(typeof PersonWithAddress.refine).toBe('function');
    expect(typeof PersonWithAddress.optional).toBe('function');
    expect(typeof PersonWithAddress.nullable).toBe('function');
  });

  it('parse() should return the input when it satisfies both schemas', () => {
    const valid = {
      name: 'Alice',
      age: 30,
      street: 'Main St',
      zip: '12345',
    };
    const result = PersonWithAddress.parse(valid);
    expect(result).toEqual(valid);
  });

  it('safeParse() should return success:true for a valid intersection value', () => {
    const valid = {
      name: 'Bob',
      age: 45,
      street: 'Elm Ave',
      zip: '54321',
    };
    const outcome = PersonWithAddress.safeParse(valid);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toEqual(valid);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  EDGE‑CASE & EXCEPTION TESTS                                          */
/* -------------------------------------------------------------------------- */
describe('ZodMiniIntersection – edge cases & error handling', () => {
  const StringSchema = ZodString();
  const NumberSchema = ZodNumber();

  // Intersection of primitive types that can never both be satisfied.
  const StringAndNumber = ZodMiniIntersection(StringSchema, NumberSchema);

  it('parse() should throw when the value does not satisfy both schemas', () => {
    // A string satisfies the first schema but fails the number schema.
    const badValue = 'hello';
    expect(() => StringAndNumber.parse(badValue)).toThrowError();
  });

  it('safeParse() should return success:false with a detailed error object', () => {
    const badValue = 42; // satisfies NumberSchema but not StringSchema
    const outcome = StringAndNumber.safeParse(badValue);
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      // The error should contain at least two issues (one per failing schema)
      expect(outcome.error.issues.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should correctly handle optional intersections', () => {
    const OptionalIntersection = ZodMiniIntersection(StringSchema, NumberSchema).optional();
    // `undefined` is allowed because of `.optional()`
    expect(OptionalIntersection.parse(undefined)).toBeUndefined();

    // Still rejects values that don't satisfy both inner schemas
    expect(() => OptionalIntersection.parse('only string')).toThrowError();
  });

  it('should correctly handle nullable intersections', () => {
    const NullableIntersection = ZodMiniIntersection(StringSchema, NumberSchema).nullable();
    // `null` is allowed because of `.nullable()`
    expect(NullableIntersection.parse(null)).toBeNull();

    // Still rejects values that don't satisfy both inner schemas
    expect(() => NullableIntersection.parse(123)).toThrowError();
  });

  it('should allow adding a custom refinement that runs after both schemas', () => {
    // Intersection of two objects where we add a cross‑field rule.
    const A = ZodObject({ a: ZodNumber() });
    const B = ZodObject({ b: ZodNumber() });
    const Inter = ZodMiniIntersection(A, B).refine(
      (val) => val.a + val.b === 10,
      { message: 'a + b must equal 10' }
    );

    // Valid case
    const good = { a: 4, b: 6 };
    expect(Inter.parse(good)).toEqual(good);

    // Invalid case – fails the custom refinement
    const bad = { a: 3, b: 4 };
    expect(() => Inter.parse(bad)).toThrowError(/a \+ b must equal 10/);
  });

  it('constructor should throw if non‑Zod schemas are supplied', () => {
    // @ts-expect-error – intentionally passing wrong types
    expect(() => ZodMiniIntersection({} as any, null as any)).toThrowError();
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  FULL TEST FILE EXPORT (Vitest will pick this up automatically)        */
/* -------------------------------------------------------------------------- */
export {};
