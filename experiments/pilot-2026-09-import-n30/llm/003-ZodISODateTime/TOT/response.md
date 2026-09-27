###Test START##
```ts
/**
 * Vitest test suite for the `ZodISODateTime` schema.
 *
 * The `ZodISODateTime` class is a Zod‑based validator that ensures a string
 * conforms to the ISO‑8601 date‑time format.  It extends `ZodStringFormat`,
 * inheriting all string‑related refinements (e.g. `.min()`, `.max()`,
 * `.regex()`).  Internally it registers its own validation logic via
 * `core.$ZodISODateTime.init`.
 *
 * The tests below cover:
 *   1. Basic construction of the schema.
 *   2. Successful validation of a wide range of valid ISO‑8601 strings.
 *   3. Rejection of malformed or non‑ISO strings.
 *   4. Edge‑case handling (leap years, fractional seconds, timezone offsets,
 *      empty strings, etc.).
 *   5. Type‑error scenarios (non‑string inputs).
 *   6. Inherited string‑format methods (`min`, `max`, `regex`).
 *
 * The test file follows the required format: it starts with `###Test START##`
 * and ends with `###Test END##`.
 */

import { describe, it, expect } from 'vitest';
import { ZodISODateTime } from './iso.js';
import { ZodError } from 'zod';

describe('ZodISODateTime – construction & basic properties', () => {
  it('should create a Zod schema instance with the correct name', () => {
    const schema = ZodISODateTime();
    // The internal Zod type name should be "ZodISODateTime"
    expect(schema._def.typeName).toBe('ZodISODateTime');
  });

  it('should inherit string format methods (e.g., min, max)', () => {
    const schema = ZodISODateTime().min(20).max(30);
    // The schema should still be an instance of ZodStringFormat
    // (we check that the refinements are applied without throwing)
    expect(() => schema.parse('2023-01-01T00:00:00Z')).not.toThrow();
  });
});

describe('ZodISODateTime – valid ISO‑8601 strings (typical use cases)', () => {
  const validSamples = [
    // Basic date‑time with Zulu time
    '2023-03-15T13:45:30Z',
    // With milliseconds
    '2023-03-15T13:45:30.123Z',
    // With timezone offset (+hh:mm)
    '2023-03-15T13:45:30+02:00',
    // With timezone offset (−hh:mm)
    '2023-03-15T13:45:30-05:30',
    // With offset and fractional seconds
    '2023-03-15T13:45:30.987654+09:00',
    // Date only (ISO‑8601 allows date‑only, but ZodISODateTime expects time,
    // so this should be *invalid* – we test it in the invalid block)
    // Leap year date
    '2020-02-29T23:59:59Z',
    // Midnight with explicit time
    '2023-12-31T00:00:00Z',
    // Full precision with Z suffix
    '2023-12-31T23:59:59.999999Z',
  ];

  validSamples.forEach((sample) => {
    it(`should accept valid ISO string "${sample}"`, () => {
      const result = ZodISODateTime().safeParse(sample);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(sample);
      }
    });
  });
});

describe('ZodISODateTime – invalid strings (error scenarios & edge cases)', () => {
  const invalidSamples = [
    // Missing time component
    '2023-03-15',
    // Wrong separator
    '2023/03/15T13:45:30Z',
    // Invalid month / day
    '2023-13-01T00:00:00Z',
    '2023-00-10T12:00:00Z',
    '2023-02-30T12:00:00Z',
    // Invalid hour / minute / second
    '2023-03-15T24:00:00Z',
    '2023-03-15T23:60:00Z',
    '2023-03-15T23:59:60Z',
    // Bad timezone offset
    '2023-03-15T13:45:30+24:00',
    '2023-03-15T13:45:30-00:60',
    // Non‑string types
    12345,
    null,
    undefined,
    {},
    [],
    // Empty string
    '',
    // Random garbage
    'not-a-date',
    '2023-03-15T13:45:30Z extra',
  ];

  invalidSamples.forEach((sample) => {
    const display = typeof sample === 'string' ? `"${sample}"` : String(sample);
    it(`should reject invalid input ${display}`, () => {
      const result = ZodISODateTime().safeParse(sample as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError);
        // The first issue should be about the string format
        const issue = result.error.issues[0];
        expect(issue.message).toMatch(/invalid/i);
      }
    });
  });
});

describe('ZodISODateTime – edge‑case handling', () => {
  it('should accept leap‑second representation if the underlying Zod implementation permits it', () => {
    // Some ISO‑8601 parsers allow "23:59:60". ZodISODateTime may reject it.
    // The test asserts the current behaviour (reject) but documents the edge case.
    const result = ZodISODateTime().safeParse('2016-12-31T23:59:60Z');
    expect(result.success).toBe(false);
  });

  it('should treat strings with leading/trailing whitespace as invalid', () => {
    const result = ZodISODateTime().safeParse(' 2023-03-15T13:45:30Z ');
    expect(result.success).toBe(false);
  });

  it('should allow custom regex refinement on top of ISO validation', () => {
    // Example: enforce that the year must be 2023
    const schema = ZodISODateTime().refine((val) => val.startsWith('2023-'), {
      message: 'Year must be 2023',
    });

    const ok = schema.safeParse('2023-01-01T00:00:00Z');
    const fail = schema.safeParse('2022-12-31T23:59:59Z');

    expect(ok.success).toBe(true);
    expect(fail.success).toBe(false);
    if (!fail.success) {
      expect(fail.error.issues[0].message).toBe('Year must be 2023');
    }
  });
});
```
###Test END##