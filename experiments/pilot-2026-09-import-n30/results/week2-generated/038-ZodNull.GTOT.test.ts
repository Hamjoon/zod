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
