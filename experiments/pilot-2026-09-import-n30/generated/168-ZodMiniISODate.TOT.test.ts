/**
 * Vitest test suite for the ZodMiniISODate schema.
 *
 * The ZodMiniISODate schema is expected to validate strings that conform
 * to the ISO‑8601 date format (YYYY‑MM‑DD) without a time component.
 *
 * The tests cover:
 *   • Typical valid dates
 *   • Edge‑case dates (leap years, max year)
 *   • Invalid formats and values
 *   • Non‑string inputs
 *   • Internal structure checks
 *
 * The schema is imported from `./iso.js` (relative to this test file).
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniISODate } from './iso.js';

describe('ZodMiniISODate schema', () => {
  // -------------------------------------------------------------------------
  // 1️⃣ Typical valid dates
  // -------------------------------------------------------------------------
  it('should accept a standard ISO date string', () => {
    const input = '2023-01-15';
    const result = ZodMiniISODate.parse(input);
    expect(result).toBe(input);
  });

  // -------------------------------------------------------------------------
  // 2️⃣ Leap‑year handling
  // -------------------------------------------------------------------------
  it('should accept February 29 on a leap year', () => {
    const input = '2020-02-29';
    const result = ZodMiniISODate.parse(input);
    expect(result).toBe(input);
  });

  it('should reject February 29 on a non‑leap year', () => {
    const input = '2021-02-29';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  // -------------------------------------------------------------------------
  // 3️⃣ Upper bound year
  // -------------------------------------------------------------------------
  it('should accept the maximum representable ISO year (9999-12-31)', () => {
    const input = '9999-12-31';
    const result = ZodMiniISODate.parse(input);
    expect(result).toBe(input);
  });

  // -------------------------------------------------------------------------
  // 4️⃣ Invalid format variations
  // -------------------------------------------------------------------------
  it('should reject dates with slashes instead of hyphens', () => {
    const input = '2023/01/15';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject dates missing leading zeros', () => {
    const input = '2023-1-5';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject dates with extra characters', () => {
    const input = '2023-01-15T00:00:00Z';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  // -------------------------------------------------------------------------
  // 5️⃣ Invalid calendar dates
  // -------------------------------------------------------------------------
  it('should reject an impossible month (13)', () => {
    const input = '2023-13-01';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject an impossible day (00)', () => {
    const input = '2023-01-00';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject an impossible day (31 in April)', () => {
    const input = '2023-04-31';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  // -------------------------------------------------------------------------
  // 6️⃣ Empty and whitespace handling
  // -------------------------------------------------------------------------
  it('should reject an empty string', () => {
    const input = '';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject a string with surrounding whitespace', () => {
    const input = ' 2023-01-15 ';
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  // -------------------------------------------------------------------------
  // 7️⃣ Non‑string inputs
  // -------------------------------------------------------------------------
  it('should reject a number', () => {
    // @ts-expect-error – intentionally passing wrong type
    const input = 20230115;
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  it('should reject a Date object', () => {
    // @ts-expect-error – intentionally passing wrong type
    const input = new Date('2023-01-15');
    expect(() => ZodMiniISODate.parse(input)).toThrowError();
  });

  // -------------------------------------------------------------------------
  // 8️⃣ Internal schema shape verification
  // -------------------------------------------------------------------------
  it('should expose the internal _zod property with the correct identifier', () => {
    // The schema instance itself should carry the `_zod` internal marker.
    // We only check that the property exists and its `$type` matches the
    // constructor name used in the source (`"$ZodISODate"`).
    // @ts-ignore – accessing internal property for test purposes
    const internal = (ZodMiniISODate as any)._zod;
    expect(internal).toBeDefined();
    expect(internal.$type).toBe('$ZodISODate');
  });
});
