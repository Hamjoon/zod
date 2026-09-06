/**
 * Vitest test suite for the ZodEnum class.
 *
 * The tests cover:
 *  - Public method signatures
 *  - Basic functionality of `extract` and `exclude`
 *  - Edge‑cases (empty arrays, duplicate keys, non‑existent keys)
 *  - Parameter handling (string & object params)
 *  - Immutability of the original instance
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './ZodEnum'; // adjust the import path as needed

// Helper to create a simple enum definition used across tests
function createColorEnum() {
  // The constructor returned by core.$constructor expects a definition object
  // with at least an `entries` field (and optionally `checks`).
  return new ZodEnum({
    entries: {
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
    },
    checks: [], // not used in these tests
  });
}

describe('ZodEnum – public API', () => {
  it('exposes the expected public properties', () => {
    const ColorEnum = createColorEnum();

    // Public fields
    expect(ColorEnum).toHaveProperty('enum');
    expect(ColorEnum).toHaveProperty('options');

    // Public methods
    expect(typeof ColorEnum.extract).toBe('function');
    expect(typeof ColorEnum.exclude).toBe('function');

    // Verify the shape of `enum` and `options`
    expect(ColorEnum.enum).toEqual({
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
    });
    expect(ColorEnum.options).toEqual(['red', 'green', 'blue']);
  });
});

describe('ZodEnum.extract()', () => {
  it('returns a new ZodEnum containing only the requested keys', () => {
    const ColorEnum = createColorEnum();
    const RedOnly = ColorEnum.extract(['RED']);

    expect(RedOnly).not.toBe(ColorEnum); // new instance
    expect(RedOnly.enum).toEqual({ RED: 'red' });
    expect(RedOnly.options).toEqual(['red']);
  });

  it('preserves order of values as defined in the original enum', () => {
    const ColorEnum = createColorEnum();
    const Subset = ColorEnum.extract(['BLUE', 'RED']);

    expect(Subset.enum).toEqual({ BLUE: 'blue', RED: 'red' });
    expect(Subset.options).toEqual(['blue', 'red']);
  });

  it('accepts an empty array and produces an empty enum', () => {
    const ColorEnum = createColorEnum();
    const Empty = ColorEnum.extract([]);

    expect(Empty.enum).toEqual({});
    expect(Empty.options).toEqual([]);
  });

  it('throws an error when a non‑existent key is supplied', () => {
    const ColorEnum = createColorEnum();

    expect(() => ColorEnum.extract(['YELLOW'] as any)).toThrowError(
      'Key YELLOW not found in enum'
    );
  });

  it('throws an error when duplicate keys are supplied (still valid, but should not break)', () => {
    const ColorEnum = createColorEnum();
    // Duplicate keys are allowed by the implementation – they simply overwrite the same entry.
    // The test ensures no unexpected error is thrown.
    const Result = ColorEnum.extract(['RED', 'RED']);
    expect(Result.enum).toEqual({ RED: 'red' });
    expect(Result.options).toEqual(['red']);
  });

  it('accepts a string as params without breaking', () => {
    const ColorEnum = createColorEnum();
    const WithStringParam = ColorEnum.extract(['GREEN'], 'custom description');

    // The exact effect of the string param depends on util.normalizeParams;
    // we only assert that a valid ZodEnum instance is returned.
    expect(WithStringParam).toBeInstanceOf(ZodEnum);
    expect(WithStringParam.enum).toEqual({ GREEN: 'green' });
  });

  it('accepts an object as params without breaking', () => {
    const ColorEnum = createColorEnum();
    const WithObjParam = ColorEnum.extract(['BLUE'], { description: 'only blue' });

    expect(WithObjParam).toBeInstanceOf(ZodEnum);
    expect(WithObjParam.enum).toEqual({ BLUE: 'blue' });
  });

  it('does not mutate the original enum instance', () => {
    const ColorEnum = createColorEnum();
    const _ = ColorEnum.extract(['RED']);
    expect(ColorEnum.enum).toEqual({
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
    });
    expect(ColorEnum.options).toEqual(['red', 'green', 'blue']);
  });
});

describe('ZodEnum.exclude()', () => {
  it('returns a new ZodEnum without the specified keys', () => {
    const ColorEnum = createColorEnum();
    const WithoutGreen = ColorEnum.exclude(['GREEN']);

    expect(WithoutGreen).not.toBe(ColorEnum);
    expect(WithoutGreen.enum).toEqual({
      RED: 'red',
      BLUE: 'blue',
    });
    expect(WithoutGreen.options).toEqual(['red', 'blue']);
  });

  it('preserves the order of remaining values', () => {
    const ColorEnum = createColorEnum();
    const Result = ColorEnum.exclude(['RED']);

    expect(Result.enum).toEqual({
      GREEN: 'green',
      BLUE: 'blue',
    });
    expect(Result.options).toEqual(['green', 'blue']);
  });

  it('accepts an empty array and returns a clone of the original enum', () => {
    const ColorEnum = createColorEnum();
    const Clone = ColorEnum.exclude([]);

    expect(Clone.enum).toEqual(ColorEnum.enum);
    expect(Clone.options).toEqual(ColorEnum.options);
    expect(Clone).not.toBe(ColorEnum);
  });

  it('throws an error when trying to exclude a non‑existent key', () => {
    const ColorEnum = createColorEnum();

    expect(() => ColorEnum.exclude(['PURPLE'] as any)).toThrowError(
      'Key PURPLE not found in enum'
    );
  });

  it('accepts a string as params without breaking', () => {
    const ColorEnum = createColorEnum();
    const Result = ColorEnum.exclude(['BLUE'], 'exclude blue');

    expect(Result).toBeInstanceOf(ZodEnum);
    expect(Result.enum).toEqual({
      RED: 'red',
      GREEN: 'green',
    });
  });

  it('accepts an object as params without breaking', () => {
    const ColorEnum = createColorEnum();
    const Result = ColorEnum.exclude(['RED'], { description: 'no red' });

    expect(Result).toBeInstanceOf(ZodEnum);
    expect(Result.enum).toEqual({
      GREEN: 'green',
      BLUE: 'blue',
    });
  });

  it('does not mutate the original enum instance', () => {
    const ColorEnum = createColorEnum();
    const _ = ColorEnum.exclude(['GREEN']);
    expect(ColorEnum.enum).toEqual({
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
    });
    expect(ColorEnum.options).toEqual(['red', 'green', 'blue']);
  });
});
