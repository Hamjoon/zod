###Test START##
```ts
/**
 * Vitest test suite for the `ZodEnum` class.
 *
 * The tests cover:
 *  - Construction and basic properties (`enum`, `options`);
 *  - `extract` – typical usage, multiple keys, empty array, and error handling;
 *  - `exclude` – typical usage, multiple keys, empty array, and error handling;
 *  - Immutability – original instance must stay unchanged after `extract`/`exclude`.
 *
 * The enum used in the tests is a simple constant object that mimics a TypeScript
 * enum (`util.EnumLike`).  The `ZodEnum` constructor is imported from `./schemas.js`
 * as required by the prompt.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – a tiny enum‑like object used throughout the suite
// ---------------------------------------------------------------------------
const ColorEnum = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
} as const;

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
describe('ZodEnum', () => {
  // -----------------------------------------------------------------------
  // Construction & basic read‑only properties
  // -----------------------------------------------------------------------
  it('should expose the original enum and options correctly', () => {
    const schema = new ZodEnum({ entries: ColorEnum });

    // `enum` should be a reference to the original definition
    expect(schema.enum).toBe(ColorEnum);

    // `options` must be an array of the enum values (order is not guaranteed)
    expect(schema.options).toEqual(expect.arrayContaining(['red', 'green', 'blue']));
    expect(schema.options).toHaveLength(3);
  });

  // -----------------------------------------------------------------------
  // extract – normal usage (single key)
  // -----------------------------------------------------------------------
  it('extract should return a new ZodEnum containing only the requested key', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const redOnly = schema.extract(['RED'] as const);

    // New schema must have a reduced enum definition
    expect(redOnly.enum).toEqual({ RED: 'red' });
    expect(redOnly.options).toEqual(['red']);

    // Original schema must stay untouched
    expect(schema.enum).toBe(ColorEnum);
    expect(schema.options).toEqual(expect.arrayContaining(['red', 'green', 'blue']));
  });

  // -----------------------------------------------------------------------
  // extract – multiple keys
  // -----------------------------------------------------------------------
  it('extract should handle multiple keys and preserve order of values', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const subset = schema.extract(['BLUE', 'RED'] as const);

    expect(subset.enum).toEqual({ BLUE: 'blue', RED: 'red' });
    // `options` order follows the order of the enum object's values,
    // which for a plain object is insertion order.
    expect(subset.options).toEqual(['blue', 'red']);
  });

  // -----------------------------------------------------------------------
  // extract – empty array (edge case)
  // -----------------------------------------------------------------------
  it('extract with an empty array should produce an empty enum', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const empty = schema.extract([] as const);

    expect(empty.enum).toEqual({});
    expect(empty.options).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // extract – unknown key should throw
  // -----------------------------------------------------------------------
  it('extract should throw when a non‑existent key is supplied', () => {
    const schema = new ZodEnum({ entries: ColorEnum });

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => schema.extract(['YELLOW'] as const)).toThrowError(
      'Key YELLOW not found in enum'
    );
  });

  // -----------------------------------------------------------------------
  // extract – params handling (string shortcut)
  // -----------------------------------------------------------------------
  it('extract should accept a string as params without breaking', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const result = schema.extract(['GREEN'] as const, 'custom message');

    // The returned schema should still be functional
    expect(result.enum).toEqual({ GREEN: 'green' });
    expect(result.options).toEqual(['green']);
    // No explicit assertion on the internal params – we just ensure no error is thrown
  });

  // -----------------------------------------------------------------------
  // exclude – normal usage (single key)
  // -----------------------------------------------------------------------
  it('exclude should return a new ZodEnum without the specified key', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const withoutRed = schema.exclude(['RED'] as const);

    expect(withoutRed.enum).toEqual({ GREEN: 'green', BLUE: 'blue' });
    expect(withoutRed.options).toEqual(expect.arrayContaining(['green', 'blue']));
    expect(withoutRed.options).toHaveLength(2);

    // Original schema must remain unchanged
    expect(schema.enum).toBe(ColorEnum);
  });

  // -----------------------------------------------------------------------
  // exclude – multiple keys
  // -----------------------------------------------------------------------
  it('exclude should handle multiple keys correctly', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const withoutRedBlue = schema.exclude(['RED', 'BLUE'] as const);

    expect(withoutRedBlue.enum).toEqual({ GREEN: 'green' });
    expect(withoutRedBlue.options).toEqual(['green']);
  });

  // -----------------------------------------------------------------------
  // exclude – empty array (edge case)
  // -----------------------------------------------------------------------
  it('exclude with an empty array should return a clone of the original enum', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const clone = schema.exclude([] as const);

    // The clone should be deep‑equal but not the same reference
    expect(clone.enum).toEqual(ColorEnum);
    expect(clone.enum).not.toBe(ColorEnum);
    expect(clone.options).toEqual(schema.options);
  });

  // -----------------------------------------------------------------------
  // exclude – unknown key should throw
  // -----------------------------------------------------------------------
  it('exclude should throw when trying to remove a non‑existent key', () => {
    const schema = new ZodEnum({ entries: ColorEnum });

    // @ts-expect-error – intentionally passing a wrong key
    expect(() => schema.exclude(['PURPLE'] as const)).toThrowError(
      'Key PURPLE not found in enum'
    );
  });

  // -----------------------------------------------------------------------
  // exclude – params handling (object shortcut)
  // -----------------------------------------------------------------------
  it('exclude should accept an object as params without breaking', () => {
    const schema = new ZodEnum({ entries: ColorEnum });
    const result = schema.exclude(['GREEN'] as const, { message: 'no green' });

    expect(result.enum).toEqual({ RED: 'red', BLUE: 'blue' });
    expect(result.options).toEqual(expect.arrayContaining(['red', 'blue']));
  });
});
```
###Test END##