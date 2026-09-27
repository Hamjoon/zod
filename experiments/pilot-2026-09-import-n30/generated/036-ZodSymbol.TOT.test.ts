/**
 * Vitest test suite for the ZodSymbol schema.
 *
 * The ZodSymbol class is exported from `./schemas.js` and represents a Zod
 * schema that validates JavaScript `Symbol` values.  The tests below cover:
 *
 * 1. Basic successful validation of symbols.
 * 2. Rejection of non‑symbol values (type errors).
 * 3. Optional handling (allows `undefined`).
 * 4. Nullable handling (allows `null`).
 * 5. Default value generation.
 * 6. Custom refinements (e.g., description‑based validation).
 * 7. Edge‑case symbols such as global symbols and the built‑in iterator symbol.
 *
 * The test file follows the required format: it starts with `###Test START##`
 * and ends with `###Test END##`.
 */

import { describe, expect, test } from 'vitest';
import { ZodSymbol } from './schemas.js';

describe('ZodSymbol schema', () => {
  /** ----------------------------------------------------------------------
   *  1️⃣  Basic validation – a plain Symbol should parse successfully.
   * ---------------------------------------------------------------------- */
  test('parses a regular Symbol', () => {
    const schema = ZodSymbol();
    const sym = Symbol('my‑symbol');
    const parsed = schema.parse(sym);
    expect(parsed).toBe(sym);
  });

  /** ----------------------------------------------------------------------
   *  2️⃣  Reject non‑symbol values.
   * ---------------------------------------------------------------------- */
  test('throws on non‑symbol values', () => {
    const schema = ZodSymbol();

    const invalidValues = [
      'string',
      123,
      true,
      null,
      undefined,
      {},
      () => Symbol('fn‑symbol'),
      Object(Symbol('wrapped')), // Symbol object wrapper
    ];

    for (const val of invalidValues) {
      expect(() => schema.parse(val as any)).toThrowError(
        /Expected symbol/, // Zod’s default error message contains “Expected symbol”
      );
    }
  });

  /** ----------------------------------------------------------------------
   *  3️⃣  Optional schema – should accept `undefined`.
   * ---------------------------------------------------------------------- */
  test('optional schema accepts undefined', () => {
    const schema = ZodSymbol().optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  /** ----------------------------------------------------------------------
   *  4️⃣  Nullable schema – should accept `null`.
   * ---------------------------------------------------------------------- */
  test('nullable schema accepts null', () => {
    const schema = ZodSymbol().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  /** ----------------------------------------------------------------------
   *  5️⃣  Default value – when input is `undefined`, the default Symbol is used.
   * ---------------------------------------------------------------------- */
  test('default schema provides a Symbol when input is undefined', () => {
    const defaultSym = Symbol('default‑sym');
    const schema = ZodSymbol().default(() => defaultSym);

    // `undefined` triggers the default
    const parsed = schema.parse(undefined);
    expect(parsed).toBe(defaultSym);
  });

  /** ----------------------------------------------------------------------
   *  6️⃣  Refinement – custom validation based on Symbol description.
   * ---------------------------------------------------------------------- */
  test('refine validates Symbol description', () => {
    const schema = ZodSymbol().refine(
      (sym) => sym.description === 'allowed',
      { message: 'Invalid symbol description' },
    );

    // ✅ Allowed description passes
    const allowed = Symbol('allowed');
    expect(schema.parse(allowed)).toBe(allowed);

    // ❌ Disallowed description throws
    const disallowed = Symbol('blocked');
    expect(() => schema.parse(disallowed)).toThrowError('Invalid symbol description');
  });

  /** ----------------------------------------------------------------------
   *  7️⃣  Edge‑case symbols – global symbols and built‑in iterator symbol.
   * ---------------------------------------------------------------------- */
  test('parses global and built‑in symbols', () => {
    const schema = ZodSymbol();

    // Global symbol via Symbol.for
    const globalSym = Symbol.for('global‑key');
    expect(schema.parse(globalSym)).toBe(globalSym);

    // Built‑in iterator symbol
    const iteratorSym = Symbol.iterator;
    expect(schema.parse(iteratorSym)).toBe(iteratorSym);
  });

  /** ----------------------------------------------------------------------
   *  8️⃣  safeParse – returns a success object for valid symbols and an error
   *       object for invalid inputs.
   * ---------------------------------------------------------------------- */
  test('safeParse returns correct result shapes', () => {
    const schema = ZodSymbol();

    // Successful case
    const success = schema.safeParse(Symbol('ok'));
    expect(success.success).toBe(true);
    if (success.success) {
      expect(success.data).toBeInstanceOf(Symbol);
    }

    // Failure case
    const failure = schema.safeParse(42);
    expect(failure.success).toBe(false);
    if (!failure.success) {
      expect(failure.error.errors[0].message).toMatch(/Expected symbol/);
    }
  });
});
