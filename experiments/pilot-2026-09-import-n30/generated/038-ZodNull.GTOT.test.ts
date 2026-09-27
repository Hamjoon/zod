import { describe, it, expect } from 'vitest';
import { ZodNull } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public API extraction (inferred from Zod’s base type)
// ---------------------------------------------------------------------------
// ZodNull (as a Zod schema) inherits the following public methods from
// `_ZodType` / `ZodType` (the most commonly used ones):
//   - parse(value: unknown): null
//   - safeParse(value: unknown): { success: true; data: null } | { success: false; error: ZodError }
//   - optional(): ZodOptional<ZodNull>
//   - nullable(): ZodNullable<ZodNull>   // (no‑op for ZodNull but part of the API)
//   - refine(...), transform(...), etc. – not needed for the basic null schema.
//
// The test suite below focuses on the core methods that are guaranteed to exist
// on any Zod schema: `parse`, `safeParse`, and the combinators `optional` and
// `nullable`.  Additional edge‑case handling is demonstrated for each method.
//
// ---------------------------------------------------------------------------
// 2️⃣  Basic functionality tests (one per method)
// ---------------------------------------------------------------------------

describe('ZodNull – basic functionality', () => {
  // Create a fresh schema instance for each test to avoid state leakage.
  const schema = ZodNull();

  // ---- parse() ------------------------------------------------------------
  it('parse() should return null when given null', () => {
    expect(schema.parse(null)).toBeNull();
  });

  // ---- safeParse() --------------------------------------------------------
  it('safeParse() should succeed for null', () => {
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeNull();
    }
  });

  // ---- optional() ---------------------------------------------------------
  it('optional() should accept undefined without throwing', () => {
    const optionalSchema = schema.optional();
    expect(() => optionalSchema.parse(undefined)).not.toThrow();
    expect(optionalSchema.parse(undefined)).toBeUndefined();
  });

  // ---- nullable() ---------------------------------------------------------
  // For ZodNull, `nullable()` is effectively a no‑op, but we still verify the
  // type contract.
  it('nullable() should still only accept null', () => {
    const nullableSchema = schema.nullable();
    expect(nullableSchema.parse(null)).toBeNull();
    expect(() => nullableSchema.parse(undefined)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// 3️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------

describe('ZodNull – edge cases & error scenarios', () => {
  const schema = ZodNull();

  // Helper to assert the shape of a ZodError (if the library is present)
  const expectZodError = (fn: () => unknown) => {
    try {
      fn();
    } catch (e: any) {
      // Zod throws an instance of ZodError; we only need to ensure it exists.
      expect(e).toBeDefined();
      expect(e.name).toBe('ZodError');
      return;
    }
    // If we reach here, no error was thrown – fail the test.
    throw new Error('Expected ZodError was not thrown');
  };

  // ---- parse() – non‑null values -----------------------------------------
  const nonNullValues = [
    undefined,
    true,
    false,
    0,
    42,
    '',
    'string',
    Symbol('sym'),
    {},
    { a: 1 },
    [],
    [null],
    () => null,
    NaN,
    Infinity,
    new Date(),
    /regex/,
  ];

  it.each(nonNullValues)('parse() should throw for non‑null value %p', (value) => {
    expectZodError(() => schema.parse(value));
  });

  // ---- safeParse() – non‑null values --------------------------------------
  it.each(nonNullValues)('safeParse() should fail for non‑null value %p', (value) => {
    const result = schema.safeParse(value);
    expect(result.success).toBe(false);
    if (!result.success) {
      // The error object should be a ZodError (or at least have a `issues` array)
      expect(result.error).toBeDefined();
      // @ts-ignore – we only check existence for safety
      expect(Array.isArray(result.error.issues)).toBe(true);
    }
  });

  // ---- optional() – passing null (valid) and other values (invalid) ------
  it('optional() should still reject non‑null, non‑undefined values', () => {
    const optionalSchema = schema.optional();
    // null is still valid
    expect(optionalSchema.parse(null)).toBeNull();

    // any other value must error
    nonNullValues
      .filter((v) => v !== undefined) // undefined is allowed by optional()
      .forEach((value) => {
        expectZodError(() => optionalSchema.parse(value));
      });
  });

  // ---- nullable() – passing undefined (invalid) -------------------------
  it('nullable() should reject undefined', () => {
    const nullableSchema = schema.nullable();
    expectZodError(() => nullableSchema.parse(undefined));
  });

  // ---- chaining combinators (optional → nullable) -------------------------
  it('optional().nullable() should accept undefined and null', () => {
    const chained = schema.optional().nullable();
    // undefined is allowed by optional()
    expect(chained.parse(undefined)).toBeUndefined();
    // null is allowed by nullable()
    expect(chained.parse(null)).toBeNull();
  });

  // ---- chaining combinators (nullable → optional) -------------------------
  it('nullable().optional() should accept undefined and null', () => {
    const chained = schema.nullable().optional();
    expect(chained.parse(undefined)).toBeUndefined();
    expect(chained.parse(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Full test file export (Vitest will pick up the file automatically)
// ---------------------------------------------------------------------------

export {};
