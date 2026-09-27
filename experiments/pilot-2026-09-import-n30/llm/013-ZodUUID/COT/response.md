**###Test START##**

```ts
/**
 * Vitest test suite for the `ZodUUID` schema.
 *
 * The `ZodUUID` export is a Zod schema that validates UUID strings.
 * It inherits all public methods from Zod's base schema types
 * (e.g. `parse`, `safeParse`, `optional`, `nullable`, `default`, etc.).
 *
 * The tests below cover:
 *   1. Basic validation of correct UUIDs.
 *   2. Rejection of malformed or non‑string inputs.
 *   3. Edge‑case handling (uppercase, empty string, missing hyphens, etc.).
 *   4. Behaviour of helper methods (`optional`, `nullable`, `default`).
 *   5. Exception handling via `parse` (throws) and `safeParse` (error object).
 */

import { describe, expect, test } from 'vitest';
import { ZodUUID } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public methods (inherited from ZodString/ZodStringFormat)
// ---------------------------------------------------------------------------
// The `ZodUUID` schema is a Zod object, therefore the most relevant public
// methods we will test are:
//
//   - parse(value: unknown): string               // throws on invalid input
//   - safeParse(value: unknown): ParseResult<string>
//   - optional(): ZodOptional<string>
//   - nullable(): ZodNullable<string>
//   - default(value: string): ZodDefault<string>
//
// (Other Zod methods such as `refine`, `transform`, `catch`, etc. exist,
// but they are not defined directly in the `ZodUUID` source file, so they
// are out of scope for this test suite.)

// ---------------------------------------------------------------------------
// 2️⃣  Helper – a collection of valid and invalid UUID samples
// ---------------------------------------------------------------------------
const VALID_UUIDS = [
  // RFC‑4122 version‑4 (lower‑case)
  '123e4567-e89b-12d3-a456-426614174000',
  // RFC‑4122 version‑1 (lower‑case)
  '6fa459ea-ee8a-3ca4-894e-db77e160355e',
  // Upper‑case UUID (Zod treats case‑insensitively for validation)
  '6FA459EA-EE8A-3CA4-894E-DB77E160355E',
];

const INVALID_UUIDS = [
  '',                                 // empty string
  'not-a-uuid',                       // completely wrong format
  '123e4567e89b12d3a456426614174000', // missing hyphens
  '123e4567-e89b-12d3-a456-42661417400', // one character short
  '123e4567-e89b-12d3-a456-4266141740000', // one character too long
  'g23e4567-e89b-12d3-a456-426614174000', // illegal hex character
  12345,                              // number
  null,                               // null (not allowed unless nullable)
  undefined,                          // undefined (not allowed unless optional)
  {},                                 // plain object
  [],                                 // array
];

// ---------------------------------------------------------------------------
// 3️⃣  Basic functionality tests
// ---------------------------------------------------------------------------
describe('ZodUUID – core validation', () => {
  test('parse() should accept valid UUID strings', () => {
    for (const uuid of VALID_UUIDS) {
      expect(ZodUUID.parse(uuid)).toBe(uuid);
    }
  });

  test('parse() should reject invalid UUID strings (throws ZodError)', () => {
    for (const bad of INVALID_UUIDS) {
      expect(() => ZodUUID.parse(bad as any)).toThrowError(); // ZodError is expected
    }
  });

  test('safeParse() returns success:true for valid UUIDs', () => {
    for (const uuid of VALID_UUIDS) {
      const result = ZodUUID.safeParse(uuid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(uuid);
      }
    }
  });

  test('safeParse() returns success:false for invalid inputs with proper error messages', () => {
    for (const bad of INVALID_UUIDS) {
      const result = ZodUUID.safeParse(bad as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        // The error should contain at least one issue with code "invalid_string"
        const issue = result.error.issues.find(i => i.code === 'invalid_string');
        expect(issue).toBeDefined();
        // The expected validation type should be "uuid"
        expect(issue?.validation?.type).toBe('uuid');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Edge‑case tests
// ---------------------------------------------------------------------------
describe('ZodUUID – edge cases', () => {
  test('uppercase UUIDs are considered valid', () => {
    const upper = '6FA459EA-EE8A-3CA4-894E-DB77E160355E';
    expect(ZodUUID.parse(upper)).toBe(upper);
  });

  test('UUID without hyphens is rejected', () => {
    const noHyphens = '123e4567e89b12d3a456426614174000';
    expect(() => ZodUUID.parse(noHyphens)).toThrowError();
  });

  test('UUID with extra whitespace is rejected (trim not performed automatically)', () => {
    const spaced = ' 123e4567-e89b-12d3-a456-426614174000 ';
    expect(() => ZodUUID.parse(spaced)).toThrowError();
  });

  test('numeric input is rejected even if it looks like a UUID when stringified', () => {
    const numeric = 1234567890;
    expect(() => ZodUUID.parse(numeric as any)).toThrowError();
  });
});

// ---------------------------------------------------------------------------
// 5️⃣  Helper method tests (optional, nullable, default)
// ---------------------------------------------------------------------------
describe('ZodUUID – schema modifiers', () => {
  test('optional() allows undefined and returns undefined', () => {
    const optionalSchema = ZodUUID.optional();
    expect(optionalSchema.parse(undefined)).toBeUndefined();
    // Still validates proper UUIDs
    expect(optionalSchema.parse(VALID_UUIDS[0])).toBe(VALID_UUIDS[0]);
  });

  test('nullable() allows null and returns null', () => {
    const nullableSchema = ZodUUID.nullable();
    expect(nullableSchema.parse(null)).toBeNull();
    // Still validates proper UUIDs
    expect(nullableSchema.parse(VALID_UUIDS[1])).toBe(VALID_UUIDS[1]);
  });

  test('default() supplies a fallback value when input is undefined', () => {
    const fallback = '00000000-0000-0000-0000-000000000000';
    const defaultSchema = ZodUUID.default(fallback);
    // undefined should be replaced by the default
    expect(defaultSchema.parse(undefined)).toBe(fallback);
    // explicit undefined via safeParse also yields the default
    const result = defaultSchema.safeParse(undefined);
    expect(result.success && result.data).toBe(fallback);
    // Providing a valid UUID overrides the default
    expect(defaultSchema.parse(VALID_UUIDS[2])).toBe(VALID_UUIDS[2]);
  });

  test('chaining modifiers works as expected (optional + default)', () => {
    const schema = ZodUUID.optional().default('11111111-1111-1111-1111-111111111111');
    // undefined -> default value
    expect(schema.parse(undefined)).toBe('11111111-1111-1111-1111-111111111111');
    // explicit undefined via safeParse
    const res = schema.safeParse(undefined);
    expect(res.success && res.data).toBe('11111111-1111-1111-1111-111111111111');
    // null is NOT allowed because we didn't call .nullable()
    expect(() => schema.parse(null as any)).toThrowError();
  });
});

// ---------------------------------------------------------------------------
// 6️⃣  Custom refinement test (demonstrates that ZodUUID can be further refined)
// ---------------------------------------------------------------------------
describe('ZodUUID – custom refinements', () => {
  test('refine() can enforce version‑4 UUIDs only', () => {
    // Simple regex that matches version‑4 UUIDs (the 13th character is "4")
    const isV4 = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
    const v4Schema = ZodUUID.refine(isV4, {
      message: 'Only version‑4 UUIDs are allowed',
    });

    const v4 = '123e4567-e89b-12d3-a456-426614174000'; // version 1 (fails)
    const v4valid = '550e8400-e29b-41d4-a716-446655440000'; // version 4 (passes)

    // Invalid version should throw
    expect(() => v4Schema.parse(v4)).toThrowError(/Only version‑4 UUIDs are allowed/);

    // Valid version passes
    expect(v4Schema.parse(v4valid)).toBe(v4valid);
  });
});
```

**###Test END##**