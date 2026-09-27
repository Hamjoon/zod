/**
 * Vitest test suite for the `ZodEnum` class exported from ./schemas.js
 *
 * The class provides two public methods:
 *   - extract<U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams)
 *   - exclude<U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams)
 *
 * The tests below cover:
 *   1. Basic functionality of each method.
 *   2. Edge‑cases such as empty input arrays and unknown keys.
 *   3. Exception handling (the methods should throw when a key is not present).
 *   4. Verification that the returned objects are still instances of `ZodEnum`.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper: a simple enum‑like object used for all tests
// ---------------------------------------------------------------------------
const Color = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
} as const;

// The constructor of `ZodEnum` expects a definition object that contains at
// least `entries` (the enum mapping) and `checks` (an internal array used by Zod).
// For our tests we can safely pass an empty `checks` array.
function createColorEnum() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – the internal shape of the definition is not part of the public API
  return new ZodEnum({ entries: Color, checks: [] });
}

// ---------------------------------------------------------------------------
// Public method signatures (extracted for documentation)
// ---------------------------------------------------------------------------
/**
 * extract<const U extends readonly (keyof T)[]>(
 *   values: U,
 *   params?: string | core.$ZodEnumParams
 * ): ZodEnum<util.Flatten<Pick<T, U[number]>>>;
 *
 * exclude<const U extends readonly (keyof T)[]>(
 *   values: U,
 *   params?: string | core.$ZodEnumParams
 * ): ZodEnum<util.Flatten<Omit<T, U[number]>>>;
 */

describe('ZodEnum – public API', () => {
  // -----------------------------------------------------------------------
  // Basic sanity checks for the freshly created enum instance
  // -----------------------------------------------------------------------
  it('should expose the original enum mapping and options', () => {
    const enumInstance = createColorEnum();

    expect(enumInstance.enum).toBe(Color);
    expect(enumInstance.options).toEqual(['red', 'green', 'blue']);
  });

  // -----------------------------------------------------------------------
  // Basic functionality of `extract`
  // -----------------------------------------------------------------------
  it('extract should keep only the requested keys', () => {
    const enumInstance = createColorEnum();

    const redOnly = enumInstance.extract(['RED'] as const);
    expect(redOnly).toBeInstanceOf(ZodEnum);
    expect(redOnly.enum).toEqual({ RED: 'red' });
    expect(redOnly.options).toEqual(['red']);
  });

  it('extract with multiple keys should keep them in order of definition', () => {
    const enumInstance = createColorEnum();

    const subset = enumInstance.extract(['GREEN', 'BLUE'] as const);
    expect(subset.enum).toEqual({ GREEN: 'green', BLUE: 'blue' });
    expect(subset.options).toEqual(['green', 'blue']);
  });

  // -----------------------------------------------------------------------
  // Basic functionality of `exclude`
  // -----------------------------------------------------------------------
  it('exclude should remove the requested keys', () => {
    const enumInstance = createColorEnum();

    const withoutBlue = enumInstance.exclude(['BLUE'] as const);
    expect(withoutBlue).toBeInstanceOf(ZodEnum);
    expect(withoutBlue.enum).toEqual({ RED: 'red', GREEN: 'green' });
    expect(withoutBlue.options).toEqual(['red', 'green']);
  });

  it('exclude with multiple keys should remove all of them', () => {
    const enumInstance = createColorEnum();

    const withoutRedGreen = enumInstance.exclude(['RED', 'GREEN'] as const);
    expect(withoutRedGreen.enum).toEqual({ BLUE: 'blue' });
    expect(withoutRedGreen.options).toEqual(['blue']);
  });

  // -----------------------------------------------------------------------
  // Edge cases – empty input arrays
  // -----------------------------------------------------------------------
  it('extract with an empty array should produce an enum with no entries', () => {
    const enumInstance = createColorEnum();

    const empty = enumInstance.extract([] as const);
    expect(empty.enum).toEqual({});
    expect(empty.options).toEqual([]);
  });

  it('exclude with an empty array should return an unchanged enum', () => {
    const enumInstance = createColorEnum();

    const unchanged = enumInstance.exclude([] as const);
    expect(unchanged.enum).toBe(Color); // reference equality – same object
    expect(unchanged.options).toEqual(['red', 'green', 'blue']);
  });

  // -----------------------------------------------------------------------
  // Edge cases – unknown keys should throw
  // -----------------------------------------------------------------------
  it('extract should throw when a key does not exist in the enum', () => {
    const enumInstance = createColorEnum();

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => enumInstance.extract(['YELLOW'] as const)).toThrow(
      /Key YELLOW not found in enum/
    );
  });

  it('exclude should throw when a key does not exist in the enum', () => {
    const enumInstance = createColorEnum();

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => enumInstance.exclude(['PURPLE'] as const)).toThrow(
      /Key PURPLE not found in enum/
    );
  });

  // -----------------------------------------------------------------------
  // Params handling – the second argument is optional and can be a string
  // -----------------------------------------------------------------------
  it('extract should accept a string as the second argument without breaking', () => {
    const enumInstance = createColorEnum();

    const result = enumInstance.extract(['GREEN'] as const, 'my‑custom‑param');
    expect(result).toBeInstanceOf(ZodEnum);
    expect(result.enum).toEqual({ GREEN: 'green' });
    expect(result.options).toEqual(['green']);
  });

  it('exclude should accept a string as the second argument without breaking', () => {
    const enumInstance = createColorEnum();

    const result = enumInstance.exclude(['RED'] as const, 'another‑param');
    expect(result).toBeInstanceOf(ZodEnum);
    expect(result.enum).toEqual({ GREEN: 'green', BLUE: 'blue' });
    expect(result.options).toEqual(['green', 'blue']);
  });

  // -----------------------------------------------------------------------
  // Params handling – the second argument can be an object (core.$ZodEnumParams)
  // -----------------------------------------------------------------------
  it('extract should accept an object as the second argument (simulated)', () => {
    const enumInstance = createColorEnum();

    // We do not know the exact shape of core.$ZodEnumParams, but any plain object
    // should be passed through `util.normalizeParams` without throwing.
    const dummyParams = { message: 'dummy' } as any;
    const result = enumInstance.extract(['BLUE'] as const, dummyParams);
    expect(result.enum).toEqual({ BLUE: 'blue' });
    expect(result.options).toEqual(['blue']);
  });

  it('exclude should accept an object as the second argument (simulated)', () => {
    const enumInstance = createColorEnum();

    const dummyParams = { errorMap: () => ({ message: 'oops' }) } as any;
    const result = enumInstance.exclude(['GREEN'] as const, dummyParams);
    expect(result.enum).toEqual({ RED: 'red', BLUE: 'blue' });
    expect(result.options).toEqual(['red', 'blue']);
  });
});
