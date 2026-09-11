**Step 1 – Public API of `ZodNull` (inherited from `ZodType`)**  

| Method | Signature (simplified) | Description |
|--------|------------------------|-------------|
| `parse(value: unknown): null` | `(value: unknown) => null` | Synchronously validates *value*; returns `null` if the value is exactly `null`, otherwise throws `ZodError`. |
| `safeParse(value: unknown): { success: true; data: null } \| { success: false; error: ZodError }` | `(value: unknown) => ParseResult<null>` | Same validation as `parse` but never throws – returns a result object. |
| `optional(): ZodOptional<ZodNull>` | `() => ZodOptional<ZodNull>` | Makes the schema accept `undefined` in addition to `null`. |
| `nullable(): ZodNullable<ZodNull>` | `() => ZodNullable<ZodNull>` | (No‑op for `ZodNull` – already nullable, but kept for API‑compatibility). |
| `default(def: null): ZodDefault<ZodNull>` | `(def: null) => ZodDefault<ZodNull>` | Supplies a default value (must be `null`). |
| `refine(...), superRefine(...), transform(...), etc.` | Various | Inherited “refinement” helpers – they work but are not the focus of this test suite. |

> **Note:** The class itself does not declare any new methods; all public behaviour comes from the base `ZodType`.  
> For the purpose of a **comprehensive** test file we will concentrate on the two core validation methods (`parse` & `safeParse`) and a few common combinators (`optional`, `default`).  

---

**Step 2 – Basic test cases (one per method)**  

| Method | Basic test idea |
|--------|-----------------|
| `parse` | Verify that `parse(null)` returns `null` and that any non‑null value throws. |
| `safeParse` | Verify that `safeParse(null)` yields `{ success: true, data: null }` and that a non‑null value yields `{ success: false }`. |
| `optional` | Verify that `schema.optional().parse(undefined)` succeeds (returns `undefined`). |
| `default` | Verify that `schema.default(null).parse(undefined)` returns the default `null`. |

Each expert would share one of the rows above; after agreement we move to edge‑case identification.

---

**Step 3 – Edge‑cases & exception scenarios**  

| Scenario | Why it matters |
|----------|----------------|
| **`undefined`** – should be rejected by the plain `ZodNull` schema. |
| **Other primitive types** – `0`, `''`, `false`, `NaN`, `Infinity`. |
| **Objects & arrays** – `{}`, `{ a: 1 }`, `[]`, `[null]`. |
| **Functions & Symbols** – `()=>{}`, `Symbol('x')`. |
| **Missing argument** – calling `parse()` with no parameter (implicitly `undefined`). |
| **Incorrect default** – calling `default(123)` should throw at schema‑construction time (Zod validates the default value). |
| **Chained combinators** – `optional().default(null)` – ensure the order does not break validation. |

---

**Step 4 – Edge‑case test implementations**  

*Each test below targets one of the scenarios above.*  

* `parse` – reject every non‑null value (including `undefined`).  
* `safeParse` – confirm `success: false` and that the error message contains “Expected null”.  
* `optional` – accept `undefined` **only** when the combinator is used.  
* `default` – accept missing input and return the supplied default; also verify that an invalid default throws when the schema is built.  

---

**Step 5 – Merged, complete Vitest test file**  

```typescript
###Test START##
import { describe, expect, test } from 'vitest';
import { ZodNull } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper: create a fresh ZodNull schema for each test to avoid state sharing
// ---------------------------------------------------------------------------
function getSchema() {
  // ZodNull is a constructor function that returns a Zod schema instance
  // (the same pattern used by the official Zod library)
  return ZodNull();
}

// ---------------------------------------------------------------------------
// 1️⃣ Core validation – parse()
// ---------------------------------------------------------------------------
describe('ZodNull.parse', () => {
  test('accepts exactly null', () => {
    const schema = getSchema();
    expect(schema.parse(null)).toBe(null);
  });

  test('rejects undefined and all non‑null values', () => {
    const schema = getSchema();
    const badValues = [
      undefined,
      0,
      1,
      -42,
      NaN,
      Infinity,
      '',
      'null',
      false,
      true,
      {},
      { a: 1 },
      [],
      [null],
      () => {},
      Symbol('zod'),
    ];

    for (const v of badValues) {
      expect(() => schema.parse(v)).toThrowError(/Expected null/);
    }
  });
});

// ---------------------------------------------------------------------------
// 2️⃣ Core validation – safeParse()
// ---------------------------------------------------------------------------
describe('ZodNull.safeParse', () => {
  test('returns success for null', () => {
    const schema = getSchema();
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(null);
    }
  });

  test('returns failure for any non‑null value', () => {
    const schema = getSchema();
    const badValues = [undefined, 0, '', {}, [], Symbol('x'), () => {}];

    for (const v of badValues) {
      const result = schema.safeParse(v);
      expect(result.success).toBe(false);
      if (!result.success) {
        // ZodError contains an array of issues; the first message should mention "null"
        expect(result.error.errors[0].message).toContain('null');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 3️⃣ Combinator – optional()
// ---------------------------------------------------------------------------
describe('ZodNull.optional', () => {
  test('parses undefined when optional is applied', () => {
    const schema = getSchema().optional();
    expect(schema.parse(undefined)).toBeUndefined();
    // still accepts null
    expect(schema.parse(null)).toBe(null);
  });

  test('still rejects non‑null, non‑undefined values', () => {
    const schema = getSchema().optional();
    const badValues = [0, '', {}, []];
    for (const v of badValues) {
      expect(() => schema.parse(v)).toThrowError(/Expected null/);
    }
  });
});

// ---------------------------------------------------------------------------
// 4️⃣ Combinator – default()
// ---------------------------------------------------------------------------
describe('ZodNull.default', () => {
  test('supplies null as default when input is undefined', () => {
    const schema = getSchema().default(null);
    // When the value is omitted (i.e. undefined) the default is used
    expect(schema.parse(undefined)).toBe(null);
    // Explicit null is still accepted
    expect(schema.parse(null)).toBe(null);
  });

  test('throws at schema construction if default is not null', () => {
    // Zod validates the default value immediately
    // The following should throw because 123 is not a valid default for ZodNull
    // (the exact error type/message may differ between Zod versions – we just assert that it throws)
    expect(() => getSchema().default(123 as any)).toThrow();
  });

  test('chaining optional() then default(null) works as expected', () => {
    const schema = getSchema().optional().default(null);
    // undefined → default (null)
    expect(schema.parse(undefined)).toBe(null);
    // null → stays null
    expect(schema.parse(null)).toBe(null);
  });
});

// ---------------------------------------------------------------------------
// 5️⃣ Miscellaneous edge‑cases (no extra methods, just sanity checks)
// ---------------------------------------------------------------------------
describe('ZodNull edge‑cases', () => {
  test('calling parse with no argument behaves like undefined', () => {
    const schema = getSchema();
    // @ts-ignore – intentionally calling without a parameter
    expect(() => schema.parse()).toThrowError(/Expected null/);
  });

  test('schema instance is a ZodType (instanceof check)', () => {
    const schema = getSchema();
    // ZodNull returns an object whose constructor name is "ZodNull"
    // The exact class hierarchy is internal, but we can at least check the name
    expect(schema.constructor.name).toBe('ZodNull');
  });
});
###Test END##
```