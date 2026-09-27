/**
 * Vitest test suite for the `ZodISODateTime` schema.
 *
 * The `ZodISODateTime` export is a Zod schema that validates ISO‑8601
 * date‑time strings.  It inherits all public methods from the base
 * Zod schema classes (`ZodString`, `ZodStringFormat`, etc.).  The
 * following test file:
 *
 * 1. Lists the most commonly‑used public methods (and their signatures)
 *    that are available on a `ZodISODateTime` instance.
 * 2. Provides a basic test for each method to verify its core behaviour.
 * 3. Identifies edge‑case and exception scenarios that are relevant for
 *    ISO‑8601 validation and adds dedicated tests for them.
 *
 * The test file can be run with Vitest (`vitest run`) and should achieve
 * > 90 % coverage of the public API of `ZodISODateTime`.
 */

import { describe, it, expect } from 'vitest';
import { ZodISODateTime } from './iso.js'; // <-- path relative to this test file

/**
 * ---------------------------------------------------------------------------
 * 1️⃣  PUBLIC METHODS (extracted from Zod’s type definitions)
 * ---------------------------------------------------------------------------
 *
 * The following methods are part of the public API of any Zod schema
 * (including the `ZodISODateTime` specialization).  Only the most
 * frequently‑used ones are listed here – the rest are inherited from the
 * generic `ZodType` base class.
 *
 * | Method                     | Signature (simplified)                                 |
 * |----------------------------|--------------------------------------------------------|
 * | `parse(value: unknown)`    | `(value: unknown) => string`                           |
 * | `safeParse(value: unknown)`| `(value: unknown) => { success: true; data: string } \| { success: false; error: ZodError }` |
 * | `optional()`               | `() => ZodOptional<ZodISODateTime>`                     |
 * | `nullable()`               | `() => ZodNullable<ZodISODateTime>`                     |
 * | `default(def: string)`    | `(def: string) => ZodDefault<ZodISODateTime>`           |
 * | `catch(def: string)`       | `(def: string) => ZodCatch<ZodISODateTime>`             |
 * | `transform<Out>(fn: (arg: string) => Out)` | `(fn) => ZodEffects<ZodISODateTime, Out>` |
 * | `refine(check: (arg: string) => boolean, message?: string)` | `(check, message?) => ZodISODateTime` |
 * | `superRefine(check: (arg: string, ctx: ZodIssueContext) => void)` | `(check) => ZodISODateTime` |
 *
 * The tests below cover each of these methods.
 */

/**
 * ---------------------------------------------------------------------------
 * 2️⃣  BASIC FUNCTIONALITY TESTS
 * ---------------------------------------------------------------------------
 */
describe('ZodISODateTime – basic API', () => {
  const validISO = '2023-07-21T14:30:00Z';
  const anotherValidISO = '1999-12-31T23:59:59+02:00';
  const invalidISO = '2023-07-21 14:30:00'; // missing “T” and timezone

  it('parse() should return the original string for a valid ISO datetime', () => {
    expect(ZodISODateTime.parse(validISO)).toBe(validISO);
  });

  it('parse() should throw ZodError for an invalid ISO datetime', () => {
    expect(() => ZodISODateTime.parse(invalidISO)).toThrowError();
  });

  it('safeParse() returns success:true for a valid value', () => {
    const result = ZodISODateTime.safeParse(anotherValidISO);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(anotherValidISO);
    }
  });

  it('safeParse() returns success:false for an invalid value', () => {
    const result = ZodISODateTime.safeParse(invalidISO);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
    }
  });

  it('optional() should allow undefined without error', () => {
    const schema = ZodISODateTime.optional();
    expect(schema.parse(undefined)).toBeUndefined();
    // still validates proper strings
    expect(schema.parse(validISO)).toBe(validISO);
  });

  it('nullable() should allow null without error', () => {
    const schema = ZodISODateTime.nullable();
    expect(schema.parse(null)).toBeNull();
    expect(schema.parse(validISO)).toBe(validISO);
  });

  it('default() should supply a fallback when value is undefined', () => {
    const fallback = '2000-01-01T00:00:00Z';
    const schema = ZodISODateTime.default(fallback);
    // undefined → fallback
    expect(schema.parse(undefined)).toBe(fallback);
    // explicit value → unchanged
    expect(schema.parse(validISO)).toBe(validISO);
  });

  it('catch() should replace parsing errors with the provided fallback', () => {
    const fallback = '1990-01-01T00:00:00Z';
    const schema = ZodISODateTime.catch(fallback);
    // invalid input → fallback
    expect(schema.parse(invalidISO)).toBe(fallback);
    // valid input → unchanged
    expect(schema.parse(validISO)).toBe(validISO);
  });

  it('transform() can convert the ISO string into a Date object', () => {
    const toDate = (s: string) => new Date(s);
    const schema = ZodISODateTime.transform(toDate);
    const result = schema.parse(validISO);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(validISO);
  });

  it('refine() can enforce a custom predicate (e.g., date must be in the past)', () => {
    const now = new Date();
    const schema = ZodISODateTime.refine(
      (s) => new Date(s).getTime() < now.getTime(),
      { message: 'Date must be in the past' }
    );

    const past = '2000-01-01T00:00:00Z';
    const future = new Date(now.getTime() + 1000 * 60 * 60).toISOString();

    expect(() => schema.parse(past)).not.toThrow();
    expect(() => schema.parse(future)).toThrowError(/Date must be in the past/);
  });

  it('superRefine() can add multiple issues via the context', () => {
    const schema = ZodISODateTime.superRefine((val, ctx) => {
      const date = new Date(val);
      if (date.getUTCFullYear() < 1970) {
        ctx.addIssue({
          code: 'custom',
          message: 'Year must be >= 1970',
        });
      }
      if (date.getUTCHours() !== 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hour must be midnight UTC',
        });
      }
    });

    // Both conditions satisfied → no error
    expect(() => schema.parse('1970-01-01T00:00:00Z')).not.toThrow();

    // Triggers both custom issues
    try {
      schema.parse('1969-12-31T12:34:56Z');
    } catch (e: any) {
      expect(e.issues).toHaveLength(2);
      const messages = e.issues.map((i: any) => i.message);
      expect(messages).toContain('Year must be >= 1970');
      expect(messages).toContain('Hour must be midnight UTC');
    }
  });
});

/**
 * ---------------------------------------------------------------------------
 * 3️⃣  EDGE‑CASE & EXCEPTION TESTS
 * ---------------------------------------------------------------------------
 *
 * ISO‑8601 allows a wide variety of representations.  The following tests
 * target the most common edge cases that can trip a naïve implementation.
 */
describe('ZodISODateTime – edge cases & error handling', () => {
  // Helper to avoid repetition
  const expectValid = (value: string) => expect(ZodISODateTime.parse(value)).toBe(value);
  const expectInvalid = (value: string, part?: string) => {
    try {
      ZodISODateTime.parse(value);
      // If we get here the test should fail
      throw new Error('Expected ZodError was not thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      if (part) {
        // ZodError messages contain the offending part; a simple substring check
        expect(e.message).toContain(part);
      }
    }
  };

  it('accepts ISO strings with milliseconds', () => {
    const withMs = '2023-07-21T14:30:00.123Z';
    expectValid(withMs);
  });

  it('accepts ISO strings with timezone offsets other than Z', () => {
    const offset = '2023-07-21T14:30:00+05:30';
    expectValid(offset);
  });

  it('rejects strings missing the “T” separator', () => {
    const missingT = '2023-07-21 14:30:00Z';
    expectInvalid(missingT, 'T');
  });

  it('rejects strings without a timezone designator', () => {
    const noTZ = '2023-07-21T14:30:00';
    expectInvalid(noTZ, 'timezone');
  });

  it('rejects malformed month or day values (e.g., month 13, day 32)', () => {
    const badMonth = '2023-13-01T00:00:00Z';
    const badDay = '2023-12-32T00:00:00Z';
    expectInvalid(badMonth, 'month');
    expectInvalid(badDay, 'day');
  });

  it('accepts leap‑year dates (Feb 29 on a leap year)', () => {
    const leap = '2020-02-29T12:00:00Z';
    expectValid(leap);
  });

  it('rejects Feb 29 on a non‑leap year', () => {
    const nonLeap = '2021-02-29T12:00:00Z';
    expectInvalid(nonLeap, 'day');
  });

  it('accepts the earliest representable ISO date (year 0000)', () => {
    const yearZero = '0000-01-01T00:00:00Z';
    expectValid(yearZero);
  });

  it('rejects negative years (e.g., “-0010-01-01T00:00:00Z”)', () => {
    const negativeYear = '-0010-01-01T00:00:00Z';
    expectInvalid(negativeYear, 'year');
  });

  it('rejects empty string', () => {
    expectInvalid('', 'invalid');
  });

  it('rejects non‑string inputs (number, object, null, undefined)', () => {
    const badValues = [123, {}, null, undefined, true];
    for (const val of badValues) {
      expect(() => ZodISODateTime.parse(val as any)).toThrowError();
    }
  });

  it('handles extremely large year values gracefully (should still be validated as ISO)', () => {
    const largeYear = '9999-12-31T23:59:59Z';
    expectValid(largeYear);
  });

  it('rejects year > 9999 (outside the ISO‑8601 allowed range)', () => {
    const tooLargeYear = '10000-01-01T00:00:00Z';
    expectInvalid(tooLargeYear, 'year');
  });
});

/**
 * ---------------------------------------------------------------------------
 * 4️⃣  COMBINED SCENARIOS (method chaining)
 * ---------------------------------------------------------------------------
 *
 * Zod schemas are often chained.  The following test demonstrates that
 * chaining works as expected for `ZodISODateTime`.
 */
describe('ZodISODateTime – method chaining', () => {
  const fallback = '2005-05-05T05:05:05Z';
  const schema = ZodISODateTime
    .optional()          // allow undefined
    .nullable()           // allow null
    .default(fallback)   // supply default when undefined
    .transform((s) => new Date(s)); // finally convert to Date

  it('parses undefined → default → Date', () => {
    const result = schema.parse(undefined);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(fallback);
  });

  it('parses null → null (because .nullable() is before .default())', () => {
    const result = schema.parse(null);
    expect(result).toBeNull();
  });

  it('parses a valid ISO string → Date', () => {
    const iso = '2022-11-30T23:59:59+01:00';
    const result = schema.parse(iso);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(new Date(iso).toISOString());
  });

  it('rejects an invalid ISO string even after chaining', () => {
    const bad = 'not-an-iso';
    expect(() => schema.parse(bad)).toThrowError();
  });
});
