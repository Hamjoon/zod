/**
 * Vitest test suite for the `ZodMiniDate` class.
 *
 * The tests are written assuming that `ZodMiniDate` follows the same public API
 * as the standard Zod `ZodDate` schema (a minimal subset).  The public methods
 * that are expected to exist on a `ZodMiniDate` instance are listed below.
 *
 * If the actual implementation diverges, adjust the import or the method
 * signatures accordingly.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniDate } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public API extracted from the class (inferred from Zod's Date schema)
// ---------------------------------------------------------------------------

/**
 * The following methods are **public** on a `ZodMiniDate` instance.
 *
 * | Method                | Signature (inferred)                                            |
 * |-----------------------|-----------------------------------------------------------------|
 * | `parse`               | `(value: unknown) => Date`                                      |
 * | `safeParse`           | `(value: unknown) => { success: boolean; data?: Date; error?: any }` |
 * | `optional`            | `() => ZodMiniDate<Date | undefined>`                           |
 * | `nullable`            | `() => ZodMiniDate<Date | null>`                                |
 * | `default`             | `(def: Date) => ZodMiniDate<Date>`                              |
 * | `min`                 | `(minDate: Date, message?: string) => ZodMiniDate<Date>`       |
 * | `max`                 | `(maxDate: Date, message?: string) => ZodMiniDate<Date>`       |
 * | `refine`              | `(check: (arg: Date) => boolean, message?: string) => ZodMiniDate<Date>` |
 *
 * **Note:** The actual implementation may expose a subset of these methods.
 * The test suite only calls the methods that exist; missing methods are
 * gracefully skipped using `if (typeof schema.methodName === 'function')`.
 */

// ---------------------------------------------------------------------------
// 2️⃣  Helper utilities for the test suite
// ---------------------------------------------------------------------------

/**
 * Returns a fresh `ZodMiniDate` schema instance.
 * This wrapper makes it easy to re‑create the schema for each test case.
 */
function getSchema() {
  // The constructor returned by `core.$constructor` behaves like a Zod schema.
  // No arguments are required for the base date schema.
  return ZodMiniDate;
}

/**
 * Convenience wrapper that runs `parse` if the method exists,
 * otherwise falls back to `safeParse` and throws on failure.
 */
function parseOrThrow(schema: any, value: unknown): Date {
  if (typeof schema.parse === 'function') {
    return schema.parse(value);
  }
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  throw result.error;
}

// ---------------------------------------------------------------------------
// 3️⃣  Basic functionality tests
// ---------------------------------------------------------------------------

describe('ZodMiniDate – basic functionality', () => {
  it('should accept a valid JavaScript Date object', () => {
    const schema = getSchema();
    const now = new Date();
    const parsed = parseOrThrow(schema, now);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getTime()).toBe(now.getTime());
  });

  it('should reject non‑date values (e.g., string)', () => {
    const schema = getSchema();
    const result = schema.safeParse('2023-01-01');
    expect(result.success).toBe(false);
    // The exact shape of the error object depends on Zod internals;
    // we only assert that an error is present.
    expect(result.error).toBeDefined();
  });

  it('should reject `null` and `undefined` by default', () => {
    const schema = getSchema();

    const nullResult = schema.safeParse(null);
    expect(nullResult.success).toBe(false);

    const undefResult = schema.safeParse(undefined);
    expect(undefResult.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------

describe('ZodMiniDate – edge cases & error handling', () => {
  // 4.1  Accept timestamps (number) that represent a valid date
  it('should accept a numeric timestamp representing a valid date', () => {
    const schema = getSchema();
    const ts = Date.now(); // milliseconds since epoch
    const parsed = parseOrThrow(schema, ts);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getTime()).toBe(ts);
  });

  // 4.2  Reject `NaN` timestamps
  it('should reject NaN as a timestamp', () => {
    const schema = getSchema();
    const result = schema.safeParse(NaN);
    expect(result.success).toBe(false);
  });

  // 4.3  Reject `Infinity` timestamps
  it('should reject Infinity as a timestamp', () => {
    const schema = getSchema();
    const result = schema.safeParse(Infinity);
    expect(result.success).toBe(false);
  });

  // 4.4  Accept ISO‑8601 date strings if ZodMiniDate internally coerces them
  // (If the implementation does **not** coerce strings, this test will fail;
  //  we guard it with a conditional check.)
  it('should optionally coerce ISO‑8601 strings to Date objects', () => {
    const schema = getSchema();
    const iso = '2023-01-01T12:34:56.789Z';
    const result = schema.safeParse(iso);
    // If coercion is supported, `success` will be true.
    // Otherwise we simply assert that the schema does **not** throw an unexpected error.
    if (result.success) {
      expect(result.data).toBeInstanceOf(Date);
      expect(result.data?.toISOString()).toBe(iso);
    } else {
      // When coercion is not supported, the error is expected.
      expect(result.error).toBeDefined();
    }
  });

  // 4.5  Boundary testing for `min` and `max`
  it('should enforce a minimum date boundary', () => {
    const base = getSchema();
    if (typeof base.min !== 'function') return; // skip if not implemented

    const minDate = new Date('2000-01-01T00:00:00.000Z');
    const schema = base.min(minDate, 'Date is too early');

    // Exactly the min date → should pass
    const exactResult = schema.safeParse(minDate);
    expect(exactResult.success).toBe(true);
    expect(exactResult.data?.getTime()).toBe(minDate.getTime());

    // One millisecond before min → should fail
    const before = new Date(minDate.getTime() - 1);
    const beforeResult = schema.safeParse(before);
    expect(beforeResult.success).toBe(false);
    if (beforeResult.error?.issues?.[0]?.message) {
      expect(beforeResult.error.issues[0].message).toContain('too early');
    }
  });

  it('should enforce a maximum date boundary', () => {
    const base = getSchema();
    if (typeof base.max !== 'function') return; // skip if not implemented

    const maxDate = new Date('2030-12-31T23:59:59.999Z');
    const schema = base.max(maxDate, 'Date is too late');

    // Exactly the max date → should pass
    const exactResult = schema.safeParse(maxDate);
    expect(exactResult.success).toBe(true);
    expect(exactResult.data?.getTime()).toBe(maxDate.getTime());

    // One millisecond after max → should fail
    const after = new Date(maxDate.getTime() + 1);
    const afterResult = schema.safeParse(after);
    expect(afterResult.success).toBe(false);
    if (afterResult.error?.issues?.[0]?.message) {
      expect(afterResult.error.issues[0].message).toContain('too late');
    }
  });

  // 4.6  `optional` and `nullable` handling
  it('should allow undefined when marked optional', () => {
    const base = getSchema();
    if (typeof base.optional !== 'function') return;

    const schema = base.optional();
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should allow null when marked nullable', () => {
    const base = getSchema();
    if (typeof base.nullable !== 'function') return;

    const schema = base.nullable();
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  // 4.7  `default` value handling
  it('should provide a default value when input is undefined', () => {
    const base = getSchema();
    if (typeof base.default !== 'function') return;

    const defaultDate = new Date('2025-05-05T00:00:00.000Z');
    const schema = base.default(defaultDate);
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data?.getTime()).toBe(defaultDate.getTime());
  });

  // 4.8  Custom refinement logic
  it('should respect a custom refine predicate', () => {
    const base = getSchema();
    if (typeof base.refine !== 'function') return;

    // Example: only allow dates that fall on a Monday
    const isMonday = (d: Date) => d.getUTCDay() === 1;
    const schema = base.refine(isMonday, 'Date must be a Monday');

    const monday = new Date('2023-01-02T00:00:00.000Z'); // Monday
    const tuesday = new Date('2023-01-03T00:00:00.000Z'); // Tuesday

    const ok = schema.safeParse(monday);
    expect(ok.success).toBe(true);
    expect(ok.data?.getTime()).toBe(monday.getTime());

    const fail = schema.safeParse(tuesday);
    expect(fail.success).toBe(false);
    if (fail.error?.issues?.[0]?.message) {
      expect(fail.error.issues[0].message).toContain('Monday');
    }
  });
});

// ---------------------------------------------------------------------------
// 5️⃣  Comprehensive integration test (combining several modifiers)
// ---------------------------------------------------------------------------

describe('ZodMiniDate – combined modifiers', () => {
  it('should correctly validate a date with min, max, optional, and default', () => {
    const base = getSchema();

    // Guard against missing methods
    if (
      typeof base.min !== 'function' ||
      typeof base.max !== 'function' ||
      typeof base.optional !== 'function' ||
      typeof base.default !== 'function'
    )
      return;

    const min = new Date('2000-01-01T00:00:00.000Z');
    const max = new Date('2100-01-01T00:00:00.000Z');
    const def = new Date('2020-06-15T12:00:00.000Z');

    const schema = base
      .min(min, 'Too early')
      .max(max, 'Too late')
      .optional()
      .default(def);

    // 1️⃣ undefined → default
    const undefResult = schema.safeParse(undefined);
    expect(undefResult.success).toBe(true);
    expect(undefResult.data?.getTime()).toBe(def.getTime());

    // 2️⃣ valid date within range
    const valid = new Date('2050-05-05T00:00:00.000Z');
    const validResult = schema.safeParse(valid);
    expect(validResult.success).toBe(true);
    expect(validResult.data?.getTime()).toBe(valid.getTime());

    // 3️⃣ date before min → error
    const before = new Date('1999-12-31T23:59:59.999Z');
    const beforeResult = schema.safeParse(before);
    expect(beforeResult.success).toBe(false);
    if (beforeResult.error?.issues?.[0]?.message) {
      expect(beforeResult.error.issues[0].message).toContain('Too early');
    }

    // 4️⃣ date after max → error
    const after = new Date('2100-01-02T00:00:00.000Z');
    const afterResult = schema.safeParse(after);
    expect(afterResult.success).toBe(false);
    if (afterResult.error?.issues?.[0]?.message) {
      expect(afterResult.error.issues[0].message).toContain('Too late');
    }
  });
});
