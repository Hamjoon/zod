import { describe, it, expect } from 'vitest';
import { ZodSymbol } from './schemas.js';
import { ZodError } from 'zod';

// Helper symbols used across many tests
const symA = Symbol('a');
const symB = Symbol('b');
const defaultSym = Symbol('default');

describe('ZodSymbol – core validation', () => {
  it('parse() should accept a valid Symbol', () => {
    const schema = ZodSymbol();
    expect(schema.parse(symA)).toBe(symA);
  });

  it('parse() should reject non‑symbol values', () => {
    const schema = ZodSymbol();
    const badValues = [42, 'foo', {}, [], null, undefined, true];
    for (const val of badValues) {
      expect(() => schema.parse(val as any)).toThrowError(ZodError);
    }
  });

  it('parse() should reject Symbol object wrappers', () => {
    const schema = ZodSymbol();
    const wrapper = Object(symA);
    expect(() => schema.parse(wrapper as any)).toThrowError(ZodError);
  });

  it('safeParse() returns success for a valid Symbol', () => {
    const schema = ZodSymbol();
    const result = schema.safeParse(symB);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(symB);
    }
  });

  it('safeParse() returns failure for invalid input', () => {
    const schema = ZodSymbol();
    const result = schema.safeParse('not a symbol' as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
    }
  });
});

describe('ZodSymbol – optional / nullable / default', () => {
  it('optional() allows undefined', () => {
    const schema = ZodSymbol().optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('nullable() allows null', () => {
    const schema = ZodSymbol().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it('default() supplies a fallback for undefined', () => {
    const schema = ZodSymbol().default(defaultSym);
    expect(schema.parse(undefined)).toBe(defaultSym);
  });

  it('default() still validates provided symbols', () => {
    const schema = ZodSymbol().default(defaultSym);
    expect(schema.parse(symA)).toBe(symA);
  });
});

describe('ZodSymbol – custom refinement', () => {
  it('refine() can enforce additional constraints', () => {
    const schema = ZodSymbol().refine(
      (s) => s.description === 'allowed',
      { message: 'Only symbols with description "allowed" are permitted' }
    );

    const allowed = Symbol('allowed');
    const disallowed = Symbol('blocked');

    // should pass
    expect(schema.parse(allowed)).toBe(allowed);

    // should fail with a ZodError containing our custom message
    try {
      schema.parse(disallowed);
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
      const err = e as ZodError;
      expect(err.errors[0].message).toContain('Only symbols with description "allowed"');
    }
  });

  it('refine() that throws internally is captured as a validation error', () => {
    const schema = ZodSymbol().refine(() => {
      throw new Error('boom');
    }, { message: 'Refine threw' });

    expect(() => schema.parse(symA)).toThrowError(ZodError);
  });
});

describe('ZodSymbol – transformation', () => {
  it('transform() can map a Symbol to another type', () => {
    const schema = ZodSymbol().transform((s) => s.toString());

    const result = schema.parse(symA);
    expect(result).toBe(symA.toString()); // e.g. "Symbol(a)"
  });

  it('transform() works together with safeParse', () => {
    const schema = ZodSymbol().transform((s) => s.description);
    const res = schema.safeParse(symB);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe('b');
    }
  });
});

describe('ZodSymbol – description & catch', () => {
  it('describe() does not affect validation', () => {
    const schema = ZodSymbol().describe('A symbol representing something');
    expect(schema.parse(symA)).toBe(symA);
  });

  it('catch() provides a fallback on validation failure', () => {
    const schema = ZodSymbol().catch(defaultSym);
    // invalid input → fallback
    expect(schema.parse('invalid' as any)).toBe(defaultSym);
    // valid input → original value
    expect(schema.parse(symA)).toBe(symA);
  });
});
