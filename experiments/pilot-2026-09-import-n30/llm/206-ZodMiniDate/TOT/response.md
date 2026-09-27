###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniDate` schema.
 *
 * The tests cover:
 *  - Typical usage (parsing Date objects and ISO strings)
 *  - Edge‑case dates (epoch, leap‑year, far‑future)
 *  - Error handling for invalid inputs
 *  - Optional / nullable modifiers
 *  - Default value handling
 *
 * The implementation of `ZodMiniDate` is a thin wrapper around the core
 * Zod‑like date internals, therefore we rely on the public API that mirrors
 * Zod’s: `.parse`, `.safeParse`, `.optional()`, `.nullable()`, `.default()`.
 *
 * If the underlying library changes its API, the tests will fail,
 * signalling that the contract of `ZodMiniDate` has been broken.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniDate } from './schemas.js';

// Helper to create a fresh schema for each test – this mirrors how Zod
// schemas are immutable, so calling a modifier (e.g. .optional()) returns a
// new instance.
const freshSchema = () => ZodMiniDate();

describe('ZodMiniDate – core parsing', () => {
  it('parses a valid Date instance', () => {
    const schema = freshSchema();
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('parses a valid ISO‑8601 string', () => {
    const schema = freshSchema();
    const iso = '2023-08-15T12:34:56.789Z';
    const parsed = schema.parse(iso);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.toISOString()).toBe(iso);
  });

  it('parses a numeric timestamp (milliseconds since epoch)', () => {
    const schema = freshSchema();
    const ts = 1_640_995_200_000; // 2022‑01‑01T00:00:00.000Z
    const parsed = schema.parse(ts);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getTime()).toBe(ts);
  });

  it('fails on an invalid date string', () => {
    const schema = freshSchema();
    const bad = '2021-02-30T00:00:00Z'; // Feb 30 does not exist
    expect(() => schema.parse(bad)).toThrowError();
  });

  it('fails on a non‑date type (object, boolean, null, undefined)', () => {
    const schema = freshSchema();
    const badValues = [{}, true, false, null, undefined, Symbol('date')];
    for (const val of badValues) {
      expect(() => schema.parse(val as any)).toThrowError();
    }
  });
});

describe('ZodMiniDate – edge cases', () => {
  it('parses the Unix epoch correctly', () => {
    const schema = freshSchema();
    const epoch = new Date(0);
    expect(schema.parse(epoch).getTime()).toBe(0);
  });

  it('parses a leap‑day date (2000‑02‑29)', () => {
    const schema = freshSchema();
    const leap = new Date('2000-02-29T00:00:00Z');
    const parsed = schema.parse(leap);
    expect(parsed.getUTCFullYear()).toBe(2000);
    expect(parsed.getUTCMonth()).toBe(1); // months are zero‑based
    expect(parsed.getUTCDate()).toBe(29);
  });

  it('rejects a non‑existent leap‑day (2021‑02‑29)', () => {
    const schema = freshSchema();
    const badLeap = '2021-02-29T00:00:00Z';
    expect(() => schema.parse(badLeap)).toThrowError();
  });

  it('parses a far‑future date without overflow', () => {
    const schema = freshSchema();
    const farFuture = new Date('9999-12-31T23:59:59.999Z');
    const parsed = schema.parse(farFuture);
    expect(parsed.getUTCFullYear()).toBe(9999);
  });
});

describe('ZodMiniDate – modifiers and utilities', () => {
  it('.optional() accepts undefined and returns undefined', () => {
    const schema = freshSchema().optional();
    expect(schema.parse(undefined)).toBeUndefined();
    // Still validates real dates
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('.nullable() accepts null and returns null', () => {
    const schema = freshSchema().nullable();
    expect(schema.parse(null)).toBeNull();
    // Still validates real dates
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('.default() supplies a default when input is undefined', () => {
    const defaultDate = new Date('2020-01-01T00:00:00Z');
    const schema = freshSchema().default(defaultDate);
    // undefined → default
    expect(schema.parse(undefined)).toBe(defaultDate);
    // explicit undefined via safeParse also yields default
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(defaultDate);
    }
    // Provided value overrides default
    const now = new Date();
    expect(schema.parse(now)).toBe(now);
  });

  it('safeParse returns a success object for valid dates', () => {
    const schema = freshSchema();
    const iso = '2023-01-01T00:00:00Z';
    const result = schema.safeParse(iso);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(Date);
      expect(result.data.toISOString()).toBe(iso);
    }
  });

  it('safeParse returns an error object for invalid inputs', () => {
    const schema = freshSchema();
    const result = schema.safeParse('not-a-date');
    expect(result.success).toBe(false);
    if (!result.success) {
      // The exact shape of the error depends on the core implementation,
      // but we at least expect a `message` property.
      expect(result.error).toHaveProperty('message');
    }
  });
});
```
###Test END##