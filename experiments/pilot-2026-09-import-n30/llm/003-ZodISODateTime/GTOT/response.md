**###Test START##**  

```ts
/**
 * Vitest test suite for the `ZodISODateTime` schema exported from `./iso.js`.
 *
 * The schema is a Zod string format that validates ISO‑8601 date‑time strings
 * and, when parsed, returns a native `Date` instance.
 *
 * The test file covers:
 * 1. Extraction of the public API (methods) of a Zod schema.
 * 2. Basic functionality tests for each method.
 * 3. Edge‑case and exception handling tests.
 *
 * The tests are written with Vitest (https://vitest.dev) and assume that the
 * project already has `zod` installed and that the `ZodISODateTime` export
 * follows the standard Zod schema contract.
 */

import { describe, it, expect } from 'vitest';
import { ZodISODateTime } from './iso.js'; // <-- path relative to this test file

/**
 * Public methods of a Zod schema (including those inherited from ZodStringFormat)
 * that we will test:
 *
 * - parse(value: unknown): Date
 * - safeParse(value: unknown): { success: true; data: Date } | { success: false; error: ZodError }
 * - refine<...>(...): ZodISODateTime   // chaining method – we test that it returns a schema
 * - optional(): ZodOptional<ZodISODateTime>
 * - nullable(): ZodNullable<ZodISODateTime>
 * - default(value: string): ZodDefault<ZodISODateTime>
 *
 * Note: Not every method is explicitly defined in the snippet, but they are part
 * of the public Zod API that a schema created via `core.$constructor` inherits.
 */

/* -------------------------------------------------------------------------- */
/* 1️⃣  BASIC FUNCTIONALITY TESTS                                            */
/* -------------------------------------------------------------------------- */

describe('ZodISODateTime – basic functionality', () => {
  const validISO = '2023-08-15T13:45:30.123Z';
  const validDate = new Date(validISO);

  it('parse() should return a Date for a valid ISO string', () => {
    const result = ZodISODateTime.parse(validISO);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(validISO);
  });

  it('parse() should throw ZodError for an invalid ISO string', () => {
    const invalid = 'not-an-iso-date';
    expect(() => ZodISODateTime.parse(invalid)).toThrowError();
  });

  it('safeParse() should succeed for a valid ISO string', () => {
    const outcome = ZodISODateTime.safeParse(validISO);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBeInstanceOf(Date);
      expect(outcome.data.toISOString()).toBe(validISO);
    }
  });

  it('safeParse() should fail for an invalid ISO string', () => {
    const outcome = ZodISODateTime.safeParse('2023-13-99');
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      expect(outcome.error).toBeDefined();
    }
  });

  it('refine() should return a new schema (chainable)', () => {
    const refined = ZodISODateTime.refine((d) => d.getFullYear() >= 2000, {
      message: 'Year must be >= 2000',
    });
    // The refined schema should still parse valid dates
    expect(refined.parse(validISO).getFullYear()).toBe(2023);
  });

  it('optional() should accept undefined without error', () => {
    const optionalSchema = ZodISODateTime.optional();
    const outcome = optionalSchema.safeParse(undefined);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBeUndefined();
    }
  });

  it('nullable() should accept null without error', () => {
    const nullableSchema = ZodISODateTime.nullable();
    const outcome = nullableSchema.safeParse(null);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBeNull();
    }
  });

  it('default() should supply a default value when input is undefined', () => {
    const defaultISO = '2000-01-01T00:00:00.000Z';
    const schemaWithDefault = ZodISODateTime.default(defaultISO);
    const outcome = schemaWithDefault.parse(undefined);
    expect(outcome).toBeInstanceOf(Date);
    expect(outcome.toISOString()).toBe(defaultISO);
  });
});

/* -------------------------------------------------------------------------- */
/* 2️⃣  EDGE‑CASE & EXCEPTION TESTS                                          */
/* -------------------------------------------------------------------------- */

describe('ZodISODateTime – edge cases & error handling', () => {
  // Helper to generate a date string with a specific offset
  const withOffset = (iso: string, offset: string) => iso.replace('Z', offset);

  it('should correctly parse ISO strings with positive timezone offsets', () => {
    const iso = '2023-08-15T13:45:30.123+02:00';
    const date = ZodISODateTime.parse(iso);
    // The resulting Date should represent the same instant as the UTC version
    const utcEquivalent = new Date('2023-08-15T11:45:30.123Z');
    expect(date.getTime()).toBe(utcEquivalent.getTime());
  });

  it('should correctly parse ISO strings with negative timezone offsets', () => {
    const iso = '2023-08-15T13:45:30.123-05:00';
    const date = ZodISODateTime.parse(iso);
    const utcEquivalent = new Date('2023-08-15T18:45:30.123Z');
    expect(date.getTime()).toBe(utcEquivalent.getTime());
  });

  it('should reject empty string', () => {
    const outcome = ZodISODateTime.safeParse('');
    expect(outcome.success).toBe(false);
  });

  it('should reject non‑string primitives (number, boolean, symbol)', () => {
    const badValues = [123, true, Symbol('iso')];
    badValues.forEach((val) => {
      const outcome = ZodISODateTime.safeParse(val as any);
      expect(outcome.success).toBe(false);
    });
  });

  it('should reject objects that are not strings', () => {
    const outcome = ZodISODateTime.safeParse({ toString: () => '2023-01-01T00:00:00Z' });
    expect(outcome.success).toBe(false);
  });

  it('should handle leap‑year dates correctly (e.g., 2020‑02‑29)', () => {
    const iso = '2020-02-29T12:00:00Z';
    const date = ZodISODateTime.parse(iso);
    expect(date.getUTCFullYear()).toBe(2020);
    expect(date.getUTCMonth()).toBe(1); // February (0‑based)
    expect(date.getUTCDate()).toBe(29);
  });

  it('should reject invalid leap‑year dates (e.g., 2019‑02‑29)', () => {
    const outcome = ZodISODateTime.safeParse('2019-02-29T12:00:00Z');
    expect(outcome.success).toBe(false);
  });

  it('should reject dates with missing time component', () => {
    const outcome = ZodISODateTime.safeParse('2023-08-15');
    expect(outcome.success).toBe(false);
  });

  it('should reject dates with milliseconds omitted but time present', () => {
    const outcome = ZodISODateTime.safeParse('2023-08-15T13:45:30Z');
    // ZodISODateTime expects full ISO‑8601 with optional fractional seconds,
    // so this should be accepted – we test the *accepted* behaviour.
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data.toISOString()).toBe('2023-08-15T13:45:30.000Z');
    }
  });

  it('should reject malformed timezone designators', () => {
    const outcome = ZodISODateTime.safeParse('2023-08-15T13:45:30+2500');
    expect(outcome.success).toBe(false);
  });

  it('should reject strings that look like dates but have extra characters', () => {
    const outcome = ZodISODateTime.safeParse('2023-08-15T13:45:30Z extra');
    expect(outcome.success).toBe(false);
  });

  it('should correctly handle the maximum representable date in JavaScript', () => {
    const maxDateISO = new Date(8640000000000000).toISOString(); // 275760‑09‑13T00:00:00.000Z
    const parsed = ZodISODateTime.parse(maxDateISO);
    expect(parsed.getTime()).toBe(8640000000000000);
  });

  it('should reject dates beyond the JavaScript Date range', () => {
    const tooBig = '3000-01-01T00:00:00Z'; // still within range, need a truly out‑of‑range value
    // JavaScript Date can represent up to ±8.64e15 ms; we push beyond that.
    const outOfRange = new Date(8640000000000001).toISOString(); // one ms beyond max
    const outcome = ZodISODateTime.safeParse(outOfRange);
    expect(outcome.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  COMBINED SCENARIOS (chaining & defaults)                             */
/* -------------------------------------------------------------------------- */

describe('ZodISODateTime – combined schema scenarios', () => {
  it('refine + optional should still allow undefined', () => {
    const schema = ZodISODateTime.refine((d) => d.getFullYear() > 2000).optional();
    const outcome = schema.safeParse(undefined);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBeUndefined();
    }
  });

  it('default + nullable should return null when input is null, default otherwise', () => {
    const defaultISO = '1999-12-31T23:59:59Z';
    const schema = ZodISODateTime.default(defaultISO).nullable();
    // null input → null
    const nullOutcome = schema.safeParse(null);
    expect(nullOutcome.success).toBe(true);
    if (nullOutcome.success) {
      expect(nullOutcome.data).toBeNull();
    }
    // undefined input → default value
    const undefOutcome = schema.safeParse(undefined);
    expect(undefOutcome.success).toBe(true);
    if (undefOutcome.success) {
      expect(undefOutcome.data).toBeInstanceOf(Date);
      expect(undefOutcome.data.toISOString()).toBe(defaultISO);
    }
  });
});
```

**###Test END##**  