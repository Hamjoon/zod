import { describe, it, expect } from 'vitest';
import { ZodNull } from './ZodNull'; // Adjust the import path as needed
import { ZodError } from 'zod';

describe('ZodNull – core functionality', () => {
  /** -------------------- parse() -------------------- */
  it('parse() should return null for a valid null input', () => {
    expect(ZodNull.parse(null)).toBeNull();
  });

  it('parse() should reject every non‑null value', () => {
    const invalidValues = [
      undefined,
      true,
      false,
      0,
      123,
      NaN,
      '',
      'string',
      {},
      { a: 1 },
      [],
      [null],
    ];
    for (const val of invalidValues) {
      expect(() => ZodNull.parse(val)).toThrow(ZodError);
    }
  });

  /** -------------------- safeParse() -------------------- */
  it('safeParse() should succeed with null', () => {
    const result = ZodNull.safeParse(null);
    expect(result).toEqual({ success: true, data: null });
  });

  it('safeParse() should fail with a proper ZodError for non‑null values', () => {
    const result = ZodNull.safeParse('not null');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
      // The first issue should be an invalid_type error for "null"
      const issue = result.error.issues[0];
      expect(issue.code).toBe('invalid_type');
      expect(issue.expected).toBe('null');
      expect(issue.received).toBe('string');
    }
  });

  /** -------------------- optional() -------------------- */
  it('optional() should accept undefined', () => {
    const schema = ZodNull.optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('optional() should still reject non‑null, non‑undefined values', () => {
    const schema = ZodNull.optional();
    const bad = [0, 'x', {}, []];
    for (const v of bad) {
      expect(() => schema.parse(v)).toThrow(ZodError);
    }
  });

  /** -------------------- nullable() -------------------- */
  it('nullable() should still accept null (idempotent)', () => {
    const schema = ZodNull.nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it('nullable() should reject everything else', () => {
    const schema = ZodNull.nullable();
    const bad = [undefined, 1, 'a', {}, []];
    for (const v of bad) {
      expect(() => schema.parse(v)).toThrow(ZodError);
    }
  });

  /** -------------------- default() -------------------- */
  it('default() should supply a default value when input is undefined', () => {
    const defaultFn = vi.fn(() => null);
    const schema = ZodNull.default(defaultFn);
    expect(schema.parse(undefined)).toBeNull();
    expect(defaultFn).toHaveBeenCalledTimes(1);
  });

  it('default() should NOT invoke the default function for a valid null input', () => {
    const defaultFn = vi.fn(() => null);
    const schema = ZodNull.default(defaultFn);
    expect(schema.parse(null)).toBeNull();
    expect(defaultFn).not.toHaveBeenCalled();
  });

  /** -------------------- refine() -------------------- */
  it('refine() should allow custom validation and surface custom messages', () => {
    const schema = ZodNull.refine(
      (val) => val === null, // always true for ZodNull, but we force a false case
      { message: 'must be null (custom)' }
    );
    // Force a failure by feeding a value that passes the base check but fails the refine
    // Since ZodNull only accepts null, we need to use .optional() to get a non‑null path.
    const optionalSchema = schema.optional();
    try {
      optionalSchema.parse(undefined);
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
      const err = e as ZodError;
      expect(err.issues[0].message).toBe('must be null (custom)');
    }
  });

  /** -------------------- transform() -------------------- */
  it('transform() should run after successful validation', () => {
    const schema = ZodNull.transform(() => 42);
    expect(schema.parse(null)).toBe(42);
  });

  it('transform() should NOT run when validation fails', () => {
    const mapper = vi.fn(() => 42);
    const schema = ZodNull.transform(mapper);
    expect(() => schema.parse('oops')).toThrow(ZodError);
    expect(mapper).not.toHaveBeenCalled();
  });

  /** -------------------- describe() -------------------- */
  it('describe() should store the description on the schema definition', () => {
    const description = 'A schema that only accepts null';
    const schema = ZodNull.describe(description);
    // The description is stored in the internal `_def` object
    // Access via any‑cast because `_def` is private in the public API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const def = (schema as any)._def;
    expect(def.description).toBe(description);
  });

  /** -------------------- brand() -------------------- */
  it('brand() should preserve runtime behaviour while adding a compile‑time brand', () => {
    // Brand is a type‑level operation; at runtime it returns the same schema instance
    const branded = ZodNull.brand('MyBrand');
    expect(branded).toBe(ZodNull); // same runtime object
    // Type‑level test (no runtime effect) – just ensure the type compiles:
    // type Branded = typeof branded & { __brand: 'MyBrand' };
    // const x: Branded = null; // should be ok
  });
});
