**###Test START##**

```ts
/**
 * Vitest test suite for the `ZodEnum` class.
 *
 * The class is exported from `./schemas.js` and provides two public
 * methods:
 *
 * 1. `extract<const U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams):
 *    ZodEnum<util.Flatten<Pick<T, U[number]>>>`
 *
 * 2. `exclude<const U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams):
 *    ZodEnum<util.Flatten<Omit<T, U[number]>>>`
 *
 * The tests below cover:
 *   • Basic functionality of both methods.
 *   • Edge‑cases such as empty input arrays.
 *   • Error handling when unknown keys are supplied.
 *   • Passing optional `params` arguments.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – create a simple ZodEnum instance for testing
// ---------------------------------------------------------------------------
function createSimpleEnum() {
  // The constructor of ZodEnum expects a definition object with an `entries`
  // property that maps enum keys to their values.  For the purpose of these
  // tests a minimal definition is sufficient.
  return new ZodEnum({
    entries: {
      A: 'alpha',
      B: 'bravo',
      C: 'charlie',
    },
  } as any); // `as any` silences TS complaints about missing internal fields
}

// ---------------------------------------------------------------------------
// Public method list (extracted from the source)
// ---------------------------------------------------------------------------
/*
  extract<U extends readonly (keyof T)[]>(
    values: U,
    params?: string | core.$ZodEnumParams
  ): ZodEnum<util.Flatten<Pick<T, U[number]>>>;

  exclude<U extends readonly (keyof T)[]>(
    values: U,
    params?: string | core.$ZodEnumParams
  ): ZodEnum<util.Flatten<Omit<T, U[number]>>>;
*/

describe('ZodEnum class', () => {
  // -----------------------------------------------------------------------
  // Basic functionality tests
  // -----------------------------------------------------------------------
  describe('extract()', () => {
    it('should return a new ZodEnum containing only the requested keys', () => {
      const original = createSimpleEnum();
      const extracted = original.extract(['A', 'C'] as const);

      // The new enum should expose the same `enum` shape but only with A & C
      expect(extracted.enum).toEqual({ A: 'alpha', C: 'charlie' });

      // `options` should be an array of the values in the same order as the keys
      expect(extracted.options).toEqual(['alpha', 'charlie']);

      // Original instance must stay unchanged
      expect(original.enum).toEqual({
        A: 'alpha',
        B: 'bravo',
        C: 'charlie',
      });
    });

    it('should work with an empty array – resulting enum has no entries', () => {
      const original = createSimpleEnum();
      const extracted = original.extract([] as const);

      expect(extracted.enum).toEqual({});
      expect(extracted.options).toEqual([]);
    });

    it('should forward string params without breaking', () => {
      const original = createSimpleEnum();
      const extracted = original.extract(['B'] as const, 'custom param');

      expect(extracted.enum).toEqual({ B: 'bravo' });
      // No explicit assertion on internal handling of the param – we only
      // verify that the call does not throw and returns a valid enum.
    });

    it('should forward object params without breaking', () => {
      const original = createSimpleEnum();
      const paramObj = { message: 'my custom message' } as any;
      const extracted = original.extract(['A'] as const, paramObj);

      expect(extracted.enum).toEqual({ A: 'alpha' });
    });

    it('should throw an Error when a non‑existent key is supplied', () => {
      const original = createSimpleEnum();

      // @ts-expect-error – intentionally passing a wrong key to test runtime error
      expect(() => original.extract(['Z'] as const)).toThrowError(
        /Key Z not found in enum/
      );
    });
  });

  // -----------------------------------------------------------------------
  // Exclude method tests
  // -----------------------------------------------------------------------
  describe('exclude()', () => {
    it('should return a new ZodEnum without the specified keys', () => {
      const original = createSimpleEnum();
      const excluded = original.exclude(['B'] as const);

      expect(excluded.enum).toEqual({
        A: 'alpha',
        C: 'charlie',
      });
      expect(excluded.options).toEqual(['alpha', 'charlie']);
    });

    it('should keep all entries when called with an empty array', () => {
      const original = createSimpleEnum();
      const excluded = original.exclude([] as const);

      expect(excluded.enum).toEqual({
        A: 'alpha',
        B: 'bravo',
        C: 'charlie',
      });
      expect(excluded.options).toEqual(['alpha', 'bravo', 'charlie']);
    });

    it('should forward string params without breaking', () => {
      const original = createSimpleEnum();
      const excluded = original.exclude(['C'] as const, 'some param');

      expect(excluded.enum).toEqual({
        A: 'alpha',
        B: 'bravo',
      });
    });

    it('should forward object params without breaking', () => {
      const original = createSimpleEnum();
      const paramObj = { code: 123 } as any;
      const excluded = original.exclude(['A'] as const, paramObj);

      expect(excluded.enum).toEqual({
        B: 'bravo',
        C: 'charlie',
      });
    });

    it('should throw an Error when trying to exclude a non‑existent key', () => {
      const original = createSimpleEnum();

      // @ts-expect-error – intentionally passing a wrong key
      expect(() => original.exclude(['X'] as const)).toThrowError(
        /Key X not found in enum/
      );
    });
  });

  // -----------------------------------------------------------------------
  // Additional edge‑case tests (type safety / runtime robustness)
  // -----------------------------------------------------------------------
  describe('edge cases & robustness', () => {
    it('extract should not mutate the original enum instance', () => {
      const original = createSimpleEnum();
      const before = { ...original.enum };
      original.extract(['A'] as const);
      expect(original.enum).toEqual(before);
    });

    it('exclude should not mutate the original enum instance', () => {
      const original = createSimpleEnum();
      const before = { ...original.enum };
      original.exclude(['B'] as const);
      expect(original.enum).toEqual(before);
    });

    it('calling extract with duplicate keys should still work (duplicates are ignored)', () => {
      const original = createSimpleEnum();
      const extracted = original.extract(['A', 'A'] as const);
      expect(extracted.enum).toEqual({ A: 'alpha' });
    });

    it('calling exclude with duplicate keys should still work (duplicates are ignored)', () => {
      const original = createSimpleEnum();
      const excluded = original.exclude(['B', 'B'] as const);
      expect(excluded.enum).toEqual({
        A: 'alpha',
        C: 'charlie',
      });
    });
  });
});
```

**###Test END##**