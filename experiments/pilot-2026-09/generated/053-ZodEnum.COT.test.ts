/**
 * Vitest test suite for the `ZodEnum` class.
 *
 * The class provides two public methods:
 *   - `extract<U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams): ZodEnum<...>`
 *   - `exclude<U extends readonly (keyof T)[]>(values: U, params?: string | core.$ZodEnumParams): ZodEnum<...>`
 *
 * The tests below cover:
 *   1. Normal behaviour of both methods.
 *   2. Edge‑cases such as empty input, duplicate keys and invalid keys.
 *   3. Verification that the original schema instance is not mutated.
 */

import { describe, it, expect } from 'vitest';
import { ZodEnum } from './ZodEnum'; // adjust the import path if necessary

// ---------------------------------------------------------------------------
// Helper – a simple enum‑like object used for all tests
// ---------------------------------------------------------------------------
const MyEnum = {
  A: 'a',
  B: 'b',
  C: 'c',
} as const;

// The internal definition object expected by the `$constructor`
// (the real Zod library supplies many more fields, but for our tests
// only `entries` and `checks` are required).  We cast to `any` to avoid
// dealing with the full internal type hierarchy.
function createZodEnumInstance<T extends Record<string, string>>(
  entries: T,
): ZodEnum<T> {
  // `ZodEnum` is a `$constructor` function, not a class, so we invoke it
  // directly with a minimal definition object.
  return (ZodEnum as any)({
    entries,
    checks: [], // no checks are needed for these tests
  });
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
describe('ZodEnum – public API', () => {
  const schema = createZodEnumInstance(MyEnum);

  // -----------------------------------------------------------------------
  // 1️⃣ Basic functionality of `extract`
  // -----------------------------------------------------------------------
  it('extract() should keep only the requested keys', () => {
    const extracted = schema.extract(['A', 'C'] as const);
    // The returned instance must expose the reduced enum and options
    expect(extracted.enum).toEqual({ A: 'a', C: 'c' });
    expect(extracted.options).toEqual(['a', 'c']);
  });

  // -----------------------------------------------------------------------
  // 2️⃣ Basic functionality of `exclude`
  // -----------------------------------------------------------------------
  it('exclude() should remove the requested keys', () => {
    const excluded = schema.exclude(['B'] as const);
    expect(excluded.enum).toEqual({ A: 'a', C: 'c' });
    expect(excluded.options).toEqual(['a', 'c']);
  });

  // -----------------------------------------------------------------------
  // 3️⃣ Original schema must stay unchanged
  // -----------------------------------------------------------------------
  it('original schema should remain untouched after extract/exclude', () => {
    // Call the methods (ignore the returned values)
    schema.extract(['A'] as const);
    schema.exclude(['B'] as const);

    // Original instance must still contain the full enum
    expect(schema.enum).toEqual(MyEnum);
    expect(schema.options).toEqual(['a', 'b', 'c']);
  });

  // -----------------------------------------------------------------------
  // 4️⃣ Edge case – empty array (no keys)
  // -----------------------------------------------------------------------
  it('extract([]) should produce an empty enum', () => {
    const empty = schema.extract([] as const);
    expect(empty.enum).toEqual({});
    expect(empty.options).toEqual([]);
  });

  it('exclude(all keys) should produce an empty enum', () => {
    const empty = schema.exclude(['A', 'B', 'C'] as const);
    expect(empty.enum).toEqual({});
    expect(empty.options).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // 5️⃣ Edge case – duplicate keys in the input array
  // -----------------------------------------------------------------------
  it('extract() with duplicate keys should not throw and keep a single entry', () => {
    const dup = schema.extract(['A', 'A'] as const);
    expect(dup.enum).toEqual({ A: 'a' });
    expect(dup.options).toEqual(['a']);
  });

  it('exclude() with duplicate keys should not throw and behave like a single removal', () => {
    const dup = schema.exclude(['B', 'B'] as const);
    expect(dup.enum).toEqual({ A: 'a', C: 'c' });
    expect(dup.options).toEqual(['a', 'c']);
  });

  // -----------------------------------------------------------------------
  // 6️⃣ Edge case – non‑existent key should raise an error
  // -----------------------------------------------------------------------
  it('extract() with an unknown key must throw', () => {
    // @ts-expect-error – intentionally passing a wrong key
    expect(() => schema.extract(['D'] as const)).toThrowError(
      'Key D not found in enum',
    );
  });

  it('exclude() with an unknown key must throw', () => {
    // @ts-expect-error – intentionally passing a wrong key
    expect(() => schema.exclude(['Z'] as const)).toThrowError(
      'Key Z not found in enum',
    );
  });

  // -----------------------------------------------------------------------
  // 7️⃣ Params handling – string or object should be accepted without
  //      affecting the resulting enum (the implementation only forwards them
  //      to `util.normalizeParams`, which is a no‑op for our tests).
  // -----------------------------------------------------------------------
  it('extract() accepts a string as params without breaking', () => {
    const withString = schema.extract(['A'] as const, 'my‑params');
    expect(withString.enum).toEqual({ A: 'a' });
    expect(withString.options).toEqual(['a']);
  });

  it('exclude() accepts an object as params without breaking', () => {
    const withObj = schema.exclude(['C'] as const, { message: 'skip C' });
    expect(withObj.enum).toEqual({ A: 'a', B: 'b' });
    expect(withObj.options).toEqual(['a', 'b']);
  });
});
