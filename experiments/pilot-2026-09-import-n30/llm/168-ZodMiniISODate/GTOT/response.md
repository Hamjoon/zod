###Test START##
```ts
/**
 * Vitest test suite for the ZodMiniISODate schema.
 *
 * The ZodMiniISODate schema validates strings that conform to the ISO‑8601
 * date format (YYYY‑MM‑DD).  The tests below cover:
 *   • Basic successful parsing of a valid date string.
 *   • Edge‑case dates such as leap‑year February 29th.
 *   • Rejection of malformed strings, non‑existent calendar dates,
 *     non‑string inputs, empty strings and whitespace‑only strings.
 *   • The behaviour of both `parse` (throws on error) and `safeParse`
 *     (returns a result object) methods.
 *
 * The schema is imported from `./iso.js` which re‑exports the constructor
 * created by the ZodMini library.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniISODate } from './iso';

describe('ZodMiniISODate', () => {
  /*** Typical usage ***/
  it('parses a valid ISO date string', () => {
    const result = ZodMiniISODate.parse('2023-05-17');
    // The schema returns the original string (no coercion to Date)
    expect(result).toBe('2023-05-17');
  });

  /*** Edge‑case dates ***/
  it('accepts a leap‑year date (2020‑02‑29)', () => {
    expect(() => ZodMiniISODate.parse('2020-02-29')).not.toThrow();
  });

  it('rejects a non‑leap‑year February 29th (2019‑02‑29)', () => {
    expect(() => ZodMiniISODate.parse('2019-02-29')).toThrow();
  });

  /*** Invalid formats ***/
  it('rejects a date with slashes instead of dashes', () => {
    expect(() => ZodMiniISODate.parse('2023/05/17')).toThrow();
  });

  it('rejects a date missing leading zeros', () => {
    expect(() => ZodMiniISODate.parse('2023-5-7')).toThrow();
  });

  /*** Non‑existent calendar dates ***/
  it('rejects an impossible date (2023‑02‑30)', () => {
    expect(() => ZodMiniISODate.parse('2023-02-30')).toThrow();
  });

  it('rejects an impossible month (2023‑13‑01)', () => {
    expect(() => ZodMiniISODate.parse('2023-13-01')).toThrow();
  });

  /*** Non‑string inputs ***/
  it('rejects a numeric input', () => {
    // @ts-ignore – intentionally passing wrong type
    expect(() => ZodMiniISODate.parse(20230517)).toThrow();
  });

  it('rejects a Date object', () => {
    // @ts-ignore – intentionally passing wrong type
    expect(() => ZodMiniISODate.parse(new Date())).toThrow();
  });

  /*** Empty / whitespace strings ***/
  it('rejects an empty string', () => {
    expect(() => ZodMiniISODate.parse('')).toThrow();
  });

  it('rejects a whitespace‑only string', () => {
    expect(() => ZodMiniISODate.parse('   ')).toThrow();
  });

  /*** safeParse behaviour ***/
  it('safeParse succeeds for a valid date', () => {
    const result = ZodMiniISODate.safeParse('1999-12-31');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('1999-12-31');
    }
  });

  it('safeParse fails for an invalid date string', () => {
    const result = ZodMiniISODate.safeParse('invalid-date');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it('safeParse fails for a non‑string input', () => {
    // @ts-ignore – intentionally passing wrong type
    const result = ZodMiniISODate.safeParse(12345);
    expect(result.success).toBe(false);
  });
});
```
###Test END##