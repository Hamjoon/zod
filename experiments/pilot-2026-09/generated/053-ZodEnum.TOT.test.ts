/**
 * Vitest test suite for the custom ZodEnum implementation.
 *
 * The tests cover:
 *  - Construction of a ZodEnum instance (enum & options properties)
 *  - The `extract` method:
 *      * typical usage (selecting a subset of keys)
 *      * handling of string and object params
 *      * edge case: empty selection array
 *      * error scenario: requesting a non‑existent key
 *  - The `exclude` method:
 *      * typical usage (removing a subset of keys)
 *      * handling of string and object params
 *      * edge case: empty exclusion array
 *      * error scenario: trying to exclude a non‑existent key
 *  - Immutability – original instance must stay unchanged after `extract`/`exclude`.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './ZodEnum'; // Adjust the import path as needed

// Helper enum used across tests
const ColorEnum = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
} as const;

// Utility to create a fresh ZodEnum instance for each test
function createColorZodEnum() {
  // The constructor expects a definition object with at least `entries` and `checks`.
  // `checks` is an internal array used by Zod; we can safely pass an empty array.
  return new ZodEnum({
    entries: ColorEnum,
    checks: [],
  });
}

describe('ZodEnum – construction', () => {
  it('should expose the original enum and options correctly', () => {
    const enumInstance = createColorZodEnum();

    // `enum` should be exactly the object we passed
    expect(enumInstance.enum).toBe(ColorEnum);

    // `options` should be an array of the enum values in insertion order
    expect(enumInstance.options).toEqual(['red', 'green', 'blue']);
  });
});

describe('ZodEnum – extract', () => {
  it('should return a new ZodEnum containing only the selected keys (typical case)', () => {
    const original = createColorZodEnum();
    const extracted = original.extract(['RED', 'BLUE']);

    // New instance should have only RED and BLUE
    expect(extracted.enum).toEqual({ RED: 'red', BLUE: 'blue' });
    expect(extracted.options).toEqual(['red', 'blue']);

    // Original instance must stay untouched
    expect(original.enum).toBe(ColorEnum);
    expect(original.options).toEqual(['red', 'green', 'blue']);
  });

  it('should accept a string as params and merge it correctly', () => {
    const original = createColorZodEnum();
    const extracted = original.extract(['GREEN'], 'customMessage');

    // The params handling is internal; we just ensure no error is thrown
    // and the resulting enum is correct.
    expect(extracted.enum).toEqual({ GREEN: 'green' });
    expect(extracted.options).toEqual(['green']);
  });

  it('should accept an object as params and merge it correctly', () => {
    const original = createColorZodEnum();
    const params = { message: 'Only red allowed' };
    const extracted = original.extract(['RED'], params);

    expect(extracted.enum).toEqual({ RED: 'red' });
    expect(extracted.options).toEqual(['red']);
  });

  it('should handle an empty selection array by returning an enum with no entries', () => {
    const original = createColorZodEnum();
    const extracted = original.extract([]);

    expect(extracted.enum).toEqual({});
    expect(extracted.options).toEqual([]);
  });

  it('should throw an error when a non‑existent key is requested', () => {
    const original = createColorZodEnum();

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => original.extract(['YELLOW'] as any)).toThrowError(
      'Key YELLOW not found in enum'
    );
  });
});

describe('ZodEnum – exclude', () => {
  it('should return a new ZodEnum without the excluded keys (typical case)', () => {
    const original = createColorZodEnum();
    const excluded = original.exclude(['GREEN']);

    // New instance should have RED and BLUE only
    expect(excluded.enum).toEqual({ RED: 'red', BLUE: 'blue' });
    expect(excluded.options).toEqual(['red', 'blue']);

    // Original instance must stay untouched
    expect(original.enum).toBe(ColorEnum);
    expect(original.options).toEqual(['red', 'green', 'blue']);
  });

  it('should accept a string as params and merge it correctly', () => {
    const original = createColorZodEnum();
    const excluded = original.exclude(['RED'], 'excludeMessage');

    expect(excluded.enum).toEqual({ GREEN: 'green', BLUE: 'blue' });
    expect(excluded.options).toEqual(['green', 'blue']);
  });

  it('should accept an object as params and merge it correctly', () => {
    const original = createColorZodEnum();
    const params = { message: 'Exclude blue' };
    const excluded = original.exclude(['BLUE'], params);

    expect(excluded.enum).toEqual({ RED: 'red', GREEN: 'green' });
    expect(excluded.options).toEqual(['red', 'green']);
  });

  it('should handle an empty exclusion array by returning an identical enum', () => {
    const original = createColorZodEnum();
    const excluded = original.exclude([]);

    // Should be a new instance but with the same entries
    expect(excluded.enum).toEqual(ColorEnum);
    expect(excluded.options).toEqual(['red', 'green', 'blue']);
  });

  it('should throw an error when trying to exclude a non‑existent key', () => {
    const original = createColorZodEnum();

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => original.exclude(['PURPLE'] as any)).toThrowError(
      'Key PURPLE not found in enum'
    );
  });
});
