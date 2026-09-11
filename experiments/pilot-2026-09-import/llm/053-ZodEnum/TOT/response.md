**###Test START##**  
```ts
import { describe, it, expect } from 'vitest';
import { ZodEnum } from './schemas.js';

/**
 * Helper definition that mimics the shape expected by the internal
 * `$constructor`.  Only the `entries` and `checks` fields are required for
 * the behaviour we are testing.
 */
const baseDef = {
  entries: { A: 'a', B: 'b', C: 'c' } as const,
  checks: [] as any[],
};

describe('ZodEnum – core behaviour', () => {
  /** --------------------------------------------------------------------
   *  1️⃣  Basic construction – enum & options are populated correctly
   * -------------------------------------------------------------------- */
  it('initialises `enum` and `options` from the definition', () => {
    const schema = new ZodEnum(baseDef);
    expect(schema.enum).toEqual(baseDef.entries);
    expect(schema.options).toEqual(['a', 'b', 'c']);
  });

  /** --------------------------------------------------------------------
   *  2️⃣  `extract` – keep only the requested keys
   * -------------------------------------------------------------------- */
  it('extracts a subset of keys (multiple keys)', () => {
    const schema = new ZodEnum(baseDef);
    const extracted = schema.extract(['A', 'C'] as const);
    expect(extracted.enum).toEqual({ A: 'a', C: 'c' });
    expect(extracted.options).toEqual(['a', 'c']);
    // original schema must stay untouched
    expect(schema.enum).toEqual(baseDef.entries);
  });

  it('extracts a subset of keys (single key)', () => {
    const schema = new ZodEnum(baseDef);
    const extracted = schema.extract(['B'] as const);
    expect(extracted.enum).toEqual({ B: 'b' });
    expect(extracted.options).toEqual(['b']);
  });

  it('extract with an empty array returns an empty enum', () => {
    const schema = new ZodEnum(baseDef);
    const extracted = schema.extract([] as const);
    expect(extracted.enum).toEqual({});
    expect(extracted.options).toEqual([]);
  });

  it('throws when a non‑existent key is supplied to extract', () => {
    const schema = new ZodEnum(baseDef);
    // @ts-expect-error – intentionally wrong key for the test
    expect(() => schema.extract(['D'] as const)).toThrowError(
      'Key D not found in enum'
    );
  });

  it('accepts a string as the second argument (params) without breaking', () => {
    const schema = new ZodEnum(baseDef);
    const extracted = schema.extract(['A'] as const, 'my description');
    expect(extracted.enum).toEqual({ A: 'a' });
    // The internal handling of the string is not observable here;
    // the test simply ensures no exception is thrown.
  });

  /** --------------------------------------------------------------------
   *  3️⃣  `exclude` – remove the requested keys
   * -------------------------------------------------------------------- */
  it('excludes a single key', () => {
    const schema = new ZodEnum(baseDef);
    const excluded = schema.exclude(['B'] as const);
    expect(excluded.enum).toEqual({ A: 'a', C: 'c' });
    expect(excluded.options).toEqual(['a', 'c']);
    // original schema must stay untouched
    expect(schema.enum).toEqual(baseDef.entries);
  });

  it('excludes multiple keys', () => {
    const schema = new ZodEnum(baseDef);
    const excluded = schema.exclude(['A', 'C'] as const);
    expect(excluded.enum).toEqual({ B: 'b' });
    expect(excluded.options).toEqual(['b']);
  });

  it('exclude with an empty array returns an identical enum', () => {
    const schema = new ZodEnum(baseDef);
    const excluded = schema.exclude([] as const);
    expect(excluded.enum).toEqual(baseDef.entries);
    expect(excluded.options).toEqual(['a', 'b', 'c']);
  });

  it('throws when a non‑existent key is supplied to exclude', () => {
    const schema = new ZodEnum(baseDef);
    // @ts-expect-error – intentionally wrong key for the test
    expect(() => schema.exclude(['Z'] as const)).toThrowError(
      'Key Z not found in enum'
    );
  });

  it('accepts an object as the second argument (params) without breaking', () => {
    const schema = new ZodEnum(baseDef);
    const params = { description: 'filtered enum' };
    const excluded = schema.exclude(['C'] as const, params);
    expect(excluded.enum).toEqual({ A: 'a', B: 'b' });
    // As with `extract`, we only verify that no error is thrown.
  });
});
```
**###Test END##**