**Step 1 – Public methods**

| Method | Signature | Description (from source) |
|--------|-----------|---------------------------|
| `extract` | `extract<const U extends readonly (keyof T)[]>(values: U, params?: string \| core.$ZodEnumParams): ZodEnum<util.Flatten<Pick<T, U[number]>>>` | Returns a new `ZodEnum` that only contains the keys listed in `values`. Throws if any key is not present in the original enum. |
| `exclude` | `exclude<const U extends readonly (keyof T)[]>(values: U, params?: string \| core.$ZodEnumParams): ZodEnum<util.Flatten<Omit<T, U[number]>>>` | Returns a new `ZodEnum` without the keys listed in `values`. Throws if any key is not present in the original enum. |

---

**Step 2 – Basic Vitest test cases**

*`extract`* – basic functionality: keep only the requested keys.  
*`exclude`* – basic functionality: drop the requested keys.

---

**Step 3 – Edge‑case & exception scenarios**

| Method | Edge‑case / Exception | Reason to test |
|--------|----------------------|----------------|
| `extract` | Pass an empty array (`[]`). | Should return a enum with **no** entries (still a valid instance). |
| `extract` | Pass a key that does **not** exist. | Should throw `Error` with message `Key … not found in enum`. |
| `extract` | Pass duplicate keys (`['A','A']`). | Duplicate keys are harmless – the resulting enum should still contain the key only once. |
| `extract` | Supply a `params` argument (string or object). | Should not affect the construction – the call must succeed. |
| `exclude` | Pass an empty array (`[]`). | Should return a copy of the original enum (all entries preserved). |
| `exclude` | Pass a key that does **not** exist. | Should throw the same `Error`. |
| `exclude` | Pass duplicate keys. | No extra effect; the key is removed once. |
| `exclude` | Supply a `params` argument. | Should not break the method. |

---

**Step 4 – Full Vitest test file (`ZodEnum.test.ts`)**

```typescript
###Test START##
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
###Test END##
```