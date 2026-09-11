import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

// Helper to create a minimal ZodEnum instance.
// The internal constructor expects a definition object with at least `entries` and `checks`.
// The real library may add more defaults – for the purpose of unit‑testing the
// `extract` / `exclude` logic this minimal shape is sufficient.
function createEnum<T extends Record<string, string>>(entries: T) {
  // @ts-ignore – the core constructor signature is not exported in the typings we have.
  return new ZodEnum({
    entries,
    checks: [], // no checks are needed for these tests
    // other internal fields are optional for the constructor used in the source
  }) as any;
}

describe('ZodEnum – public API', () => {
  const baseEnum = createEnum({
    A: 'a',
    B: 'b',
    C: 'c',
  });

  // -----------------------------------------------------------------
  // BASIC FUNCTIONALITY
  // -----------------------------------------------------------------
  it('extract – keeps only selected keys', () => {
    const extracted = baseEnum.extract(['A', 'C'] as const);
    // The new enum should expose only the two selected keys
    expect(extracted.options).to.deep.equal(['a', 'c']);
    // The internal `enum` map must only contain A and C
    expect(extracted.enum).toEqual({ A: 'a', C: 'c' });
  });

  it('exclude – removes selected keys', () => {
    const excluded = baseEnum.exclude(['B'] as const);
    expect(excluded.options).to.deep.equal(['a', 'c']);
    expect(excluded.enum).toEqual({ A: 'a', C: 'c' });
  });

  // -----------------------------------------------------------------
  // EDGE CASES – extract
  // -----------------------------------------------------------------
  it('extract – empty array returns an enum with no entries', () => {
    const empty = baseEnum.extract([] as const);
    expect(empty.options).to.deep.equal([]);
    expect(empty.enum).toEqual({});
  });

  it('extract – duplicate keys are handled gracefully', () => {
    const dup = baseEnum.extract(['A', 'A'] as const);
    expect(dup.options).to.deep.equal(['a']);
    expect(dup.enum).toEqual({ A: 'a' });
  });

  it('extract – accepts a string as params without breaking', () => {
    const withParams = baseEnum.extract(['B'] as const, 'someParam');
    expect(withParams.options).to.deep.equal(['b']);
    expect(withParams.enum).toEqual({ B: 'b' });
  });

  it('extract – throws when a non‑existent key is requested', () => {
    // @ts-expect-error – intentionally using a wrong key for test
    expect(() => baseEnum.extract(['Z'] as const)).toThrowError(
      /Key Z not found in enum/,
    );
  });

  // -----------------------------------------------------------------
  // EDGE CASES – exclude
  // -----------------------------------------------------------------
  it('exclude – empty array returns a copy of the original enum', () => {
    const copy = baseEnum.exclude([] as const);
    expect(copy.options).to.deep.equal(['a', 'b', 'c']);
    expect(copy.enum).toEqual({ A: 'a', B: 'b', C: 'c' });
  });

  it('exclude – duplicate keys are ignored after first removal', () => {
    const dup = baseEnum.exclude(['C', 'C'] as const);
    expect(dup.options).to.deep.equal(['a', 'b']);
    expect(dup.enum).toEqual({ A: 'a', B: 'b' });
  });

  it('exclude – accepts an object as params without breaking', () => {
    const withObj = baseEnum.exclude(['A'] as const, { message: 'custom' } as any);
    expect(withObj.options).to.deep.equal(['b', 'c']);
    expect(withObj.enum).toEqual({ B: 'b', C: 'c' });
  });

  it('exclude – throws when trying to remove a non‑existent key', () => {
    // @ts-expect-error – intentionally using a wrong key for test
    expect(() => baseEnum.exclude(['X'] as const)).toThrowError(
      /Key X not found in enum/,
    );
  });
});
