###Test START##
```ts
/**
 * Vitest test suite for the ZodEnum class exported from ./schemas.js
 *
 * The tests cover:
 *  - Public method signatures
 *  - Basic functionality of `extract` and `exclude`
 *  - Edge‑cases such as empty input arrays, duplicate keys and invalid keys
 *  - Exception handling (errors thrown when a key is not present)
 *  - Immutability of the original instance
 *
 * The ZodEnum constructor expects a definition object that contains at least an
 * `entries` field (the enum map) and a `checks` field (used internally by Zod).
 * For the purpose of these unit tests we provide the minimal shape required.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – create a fresh ZodEnum instance for each test suite
// ---------------------------------------------------------------------------
function createTestEnum() {
  // Minimal definition object accepted by the internal `$constructor`
  return new ZodEnum({
    entries: {
      A: 'alpha',
      B: 'beta',
      C: 'gamma',
    },
    // `checks` is required by the internal implementation; an empty array is fine.
    checks: [],
  });
}

// ---------------------------------------------------------------------------
// Public method signatures (extracted from the source)
// ---------------------------------------------------------------------------
// ZodEnum.extract<const U extends readonly (keyof T)[]>(
//   values: U,
//   params?: string | core.$ZodEnumParams
// ): ZodEnum<util.Flatten<Pick<T, U[number]>>>;
// ZodEnum.exclude<const U extends readonly (keyof T)[]>(
//   values: U,
//   params?: string | core.$ZodEnumParams
// ): ZodEnum<util.Flatten<Omit<T, U[number]>>>;

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
describe('ZodEnum – core functionality', () => {
  // -----------------------------------------------------------------------
  // Basic usage of `extract`
  // -----------------------------------------------------------------------
  it('extract() returns a new ZodEnum containing only the requested keys', () => {
    const Enum = createTestEnum();

    const extracted = Enum.extract(['A', 'C'] as const);
    // The new instance should contain only the selected entries
    expect(extracted.enum).toEqual({ A: 'alpha', C: 'gamma' });
    // `options` should be the values of the selected entries, preserving order
    expect(extracted.options).toEqual(['alpha', 'gamma']);
    // Original enum must stay untouched
    expect(Enum.enum).toEqual({ A: 'alpha', B: 'beta', C: 'gamma' });
  });

  // -----------------------------------------------------------------------
  // Edge case – empty array passed to `extract`
  // -----------------------------------------------------------------------
  it('extract([]) returns an empty ZodEnum (no entries, no options)', () => {
    const Enum = createTestEnum();

    const empty = Enum.extract([] as const);
    expect(empty.enum).toEqual({});
    expect(empty.options).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // Edge case – duplicate keys in the `extract` array
  // -----------------------------------------------------------------------
  it('extract() tolerates duplicate keys and deduplicates them internally', () => {
    const Enum = createTestEnum();

    const dup = Enum.extract(['A', 'A', 'B'] as const);
    // Duplicate keys should not cause an error and the resulting enum
    // should contain each key only once.
    expect(dup.enum).toEqual({ A: 'alpha', B: 'beta' });
    expect(dup.options).toEqual(['alpha', 'beta']);
  });

  // -----------------------------------------------------------------------
  // Error handling – unknown key supplied to `extract`
  // -----------------------------------------------------------------------
  it('extract() throws an error when a key does not exist in the enum', () => {
    const Enum = createTestEnum();

    // @ts-expect-error – intentionally passing an invalid key
    expect(() => Enum.extract(['D'] as const)).toThrowError(
      'Key D not found in enum'
    );
  });

  // -----------------------------------------------------------------------
  // Parameter handling – passing a string as the second argument
  // -----------------------------------------------------------------------
  it('extract() accepts a string as the optional params argument without breaking', () => {
    const Enum = createTestEnum();

    const result = Enum.extract(['B'] as const, 'someParam');
    expect(result.enum).toEqual({ B: 'beta' });
    expect(result.options).toEqual(['beta']);
  });

  // -----------------------------------------------------------------------
  // Basic usage of `exclude`
  // -----------------------------------------------------------------------
  it('exclude() returns a new ZodEnum without the specified keys', () => {
    const Enum = createTestEnum();

    const excluded = Enum.exclude(['B'] as const);
    expect(excluded.enum).toEqual({ A: 'alpha', C: 'gamma' });
    expect(excluded.options).toEqual(['alpha', 'gamma']);
    // Original enum must stay untouched
    expect(Enum.enum).toEqual({ A: 'alpha', B: 'beta', C: 'gamma' });
  });

  // -----------------------------------------------------------------------
  // Edge case – empty array passed to `exclude`
  // -----------------------------------------------------------------------
  it('exclude([]) returns a clone of the original enum (no keys removed)', () => {
    const Enum = createTestEnum();

    const unchanged = Enum.exclude([] as const);
    expect(unchanged.enum).toEqual(Enum.enum);
    expect(unchanged.options).toEqual(Enum.options);
  });

  // -----------------------------------------------------------------------
  // Edge case – duplicate keys in the `exclude` array
  // -----------------------------------------------------------------------
  it('exclude() tolerates duplicate keys and removes them only once', () => {
    const Enum = createTestEnum();

    const dup = Enum.exclude(['A', 'A', 'C'] as const);
    expect(dup.enum).toEqual({ B: 'beta' });
    expect(dup.options).toEqual(['beta']);
  });

  // -----------------------------------------------------------------------
  // Error handling – unknown key supplied to `exclude`
  // -----------------------------------------------------------------------
  it('exclude() throws an error when a key does not exist in the enum', () => {
    const Enum = createTestEnum();

    // @ts-expect-error – intentionally passing an invalid key
    expect(() => Enum.exclude(['X'] as const)).toThrowError(
      'Key X not found in enum'
    );
  });

  // -----------------------------------------------------------------------
  // Parameter handling – passing a string as the second argument to `exclude`
  // -----------------------------------------------------------------------
  it('exclude() accepts a string as the optional params argument without breaking', () => {
    const Enum = createTestEnum();

    const result = Enum.exclude(['C'] as const, 'anotherParam');
    expect(result.enum).toEqual({ A: 'alpha', B: 'beta' });
    expect(result.options).toEqual(['alpha', 'beta']);
  });
});
```
###Test END##