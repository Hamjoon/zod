/**
 * Vitest test suite for the `ZodMiniBigInt` schema.
 *
 * Public API (extracted from the ZodMiniBigInt interface):
 * -------------------------------------------------------
 * - parse(value: unknown): bigint
 * - safeParse(value: unknown): { success: true; data: bigint } | { success: false; error: ZodError }
 * - min(minimum: bigint, message?: string): this
 * - max(maximum: bigint, message?: string): this
 * - refine(check: (val: bigint) => boolean, message?: string): this
 * - optional(): ZodOptional<this>
 * - nullable(): ZodNullable<this>
 * - default(def: bigint): this
 * - transform<Out>(mapper: (val: bigint) => Out): ZodTransformer<this, Out>
 * - describe(description: string): this
 *
 * The tests below cover:
 *   1. Basic (happy‑path) behaviour for each method.
 *   2. Edge‑cases and error handling (wrong types, boundary values, thrown predicates/transformers, etc.).
 */

import { describe, expect, test } from 'vitest';
import { ZodMiniBigInt } from './schemas.js';

describe('ZodMiniBigInt – basic functionality', () => {
  test('parse – accepts a valid bigint', () => {
    const schema = ZodMiniBigInt();
    expect(schema.parse(42n)).toBe(42n);
  });

  test('safeParse – returns success for a valid bigint', () => {
    const schema = ZodMiniBigInt();
    const result = schema.safeParse(7n);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(7n);
  });

  test('min – rejects values smaller than the minimum', () => {
    const schema = ZodMiniBigInt().min(10n);
    expect(() => schema.parse(9n)).toThrow();
    expect(schema.parse(10n)).toBe(10n); // exact boundary should pass
  });

  test('max – rejects values larger than the maximum', () => {
    const schema = ZodMiniBigInt().max(100n);
    expect(() => schema.parse(101n)).toThrow();
    expect(schema.parse(100n)).toBe(100n); // exact boundary should pass
  });

  test('refine – custom predicate works', () => {
    const schema = ZodMiniBigInt().refine(v => v % 2n === 0n, 'must be even');
    expect(() => schema.parse(3n)).toThrow();
    expect(schema.parse(4n)).toBe(4n);
  });

  test('optional – accepts undefined', () => {
    const schema = ZodMiniBigInt().optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  test('nullable – accepts null', () => {
    const schema = ZodMiniBigInt().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  test('default – supplies a default when value is undefined', () => {
    const schema = ZodMiniBigInt().default(0n);
    // Zod treats `undefined` as “missing”, so we cast to any to hit the default path.
    expect(schema.parse(undefined as any)).toBe(0n);
  });

  test('transform – maps bigint to string', () => {
    const schema = ZodMiniBigInt().transform(v => v.toString());
    const result = schema.parse(123n);
    expect(result).toBe('123');
  });

  test('describe – does not affect validation', () => {
    const schema = ZodMiniBigInt().describe('A big integer');
    expect(schema.parse(5n)).toBe(5n);
  });
});

describe('ZodMiniBigInt – edge cases & error handling', () => {
  test('parse – rejects non‑bigint values', () => {
    const schema = ZodMiniBigInt();
    const badValues = [null, undefined, 123, '123', Symbol('x'), {}, []];
    for (const v of badValues) {
      expect(() => schema.parse(v as any)).toThrow();
    }
  });

  test('safeParse – returns failure for non‑bigint values', () => {
    const schema = ZodMiniBigInt();
    const result = schema.safeParse('not a bigint' as any);
    expect(result.success).toBe(false);
  });

  test('min – accepts the exact minimum and extreme negative values', () => {
    const minVal = -2n ** 63n; // a very large negative bigint
    const schema = ZodMiniBigInt().min(minVal);
    expect(schema.parse(minVal)).toBe(minVal);
    expect(() => schema.parse(minVal - 1n)).toThrow();
  });

  test('max – accepts the exact maximum and extreme positive values', () => {
    const maxVal = 2n ** 63n; // a very large positive bigint
    const schema = ZodMiniBigInt().max(maxVal);
    expect(schema.parse(maxVal)).toBe(maxVal);
    expect(() => schema.parse(maxVal + 1n)).toThrow();
  });

  test('refine – predicate that throws is turned into a ZodError', () => {
    const schema = ZodMiniBigInt().refine(() => {
      throw new Error('boom');
    }, 'boom');
    expect(() => schema.parse(1n)).toThrow();
  });

  test('optional + nullable – both values are accepted', () => {
    const schema = ZodMiniBigInt().optional().nullable();
    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse(null)).toBeNull();
    expect(schema.parse(10n)).toBe(10n);
  });

  test('default – only applies to undefined, not to null', () => {
    const schema = ZodMiniBigInt().default(99n);
    // undefined → default value
    expect(schema.parse(undefined as any)).toBe(99n);
    // null should still be rejected (default does not replace null)
    expect(() => schema.parse(null as any)).toThrow();
  });

  test('transform – throws inside transformer becomes validation error', () => {
    const schema = ZodMiniBigInt().transform(() => {
      throw new Error('bad transformer');
    });
    expect(() => schema.parse(5n)).toThrow();
  });
});
