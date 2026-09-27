/**
 * Vitest test suite for the `ZodSymbol` schema.
 *
 * The `ZodSymbol` class is a thin wrapper around Zod's internal
 * `$ZodSymbol` implementation.  It inherits all public methods from
 * `ZodType`, such as `parse`, `safeParse`, `optional`, `nullable`,
 * `default`, `describe`, and `refine`.  The tests below therefore
 * focus on:
 *
 * 1. Verifying that a plain `Symbol` value is accepted.
 * 2. Confirming that non‑symbol values are rejected with a proper
 *    `ZodError`.
 * 3. Exercising the common Zod schema modifiers (`optional`, `nullable`,
 *    `default`, `describe`, `refine`) to ensure they work with a
 *    `ZodSymbol` instance.
 * 4. Checking edge‑case symbols (global symbols, well‑known symbols,
 *    symbols with descriptions) and error handling paths.
 *
 * The test file is written for Vitest (https://vitest.dev) and
 * assumes that the `ZodSymbol` export lives in `./schemas.js` relative
 * to this file.
 */

import { describe, it, expect } from 'vitest';
import { ZodSymbol } from './schemas.js';
import { ZodError } from 'zod';

// ---------------------------------------------------------------------------
// Helper – a small wrapper to keep the test output readable
// ---------------------------------------------------------------------------
function expectParseSuccess<T>(schema: any, value: T) {
  expect(() => schema.parse(value)).not.toThrow();
  const result = schema.parse(value);
  expect(result).toBe(value);
}

function expectParseFailure<T>(schema: any, value: T) {
  expect(() => schema.parse(value)).toThrow(ZodError);
}

// ---------------------------------------------------------------------------
// Public method list (inherited from ZodType)
// ---------------------------------------------------------------------------
//  - parse(value: unknown): T
//  - safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }
//  - optional(): ZodOptional<ZodSymbol>
//  - nullable(): ZodNullable<ZodSymbol>
//  - default(def: T): ZodDefault<ZodSymbol>
//  - describe(description: string): this
//  - refine(check: (val: T) => boolean, message?: string | { message: string }): this
// ---------------------------------------------------------------------------

describe('ZodSymbol – core functionality', () => {
  const schema = ZodSymbol();

  it('accepts a plain Symbol', () => {
    const sym = Symbol('test');
    expectParseSuccess(schema, sym);
  });

  it('accepts a global Symbol (Symbol.for)', () => {
    const globalSym = Symbol.for('global-key');
    expectParseSuccess(schema, globalSym);
  });

  it('accepts a well‑known Symbol (Symbol.iterator)', () => {
    expectParseSuccess(schema, Symbol.iterator);
  });

  it('rejects non‑symbol primitive values', () => {
    const badValues = [undefined, null, true, false, 0, 42, '', 'string', {}, [], () => {}];
    for (const val of badValues) {
      expectParseFailure(schema, val);
    }
  });

  it('safeParse returns success for Symbol and failure for others', () => {
    const good = Symbol('good');
    const bad = 123;

    const goodResult = schema.safeParse(good);
    expect(goodResult.success).toBe(true);
    if (goodResult.success) {
      expect(goodResult.data).toBe(good);
    }

    const badResult = schema.safeParse(bad);
    expect(badResult.success).toBe(false);
    if (!badResult.success) {
      expect(badResult.error).toBeInstanceOf(ZodError);
    }
  });
});

describe('ZodSymbol – modifiers and edge cases', () => {
  it('optional() allows undefined', () => {
    const optionalSchema = ZodSymbol().optional();
    expectParseSuccess(optionalSchema, undefined);
    expectParseSuccess(optionalSchema, Symbol('opt'));
    expectParseFailure(optionalSchema, null);
  });

  it('nullable() allows null', () => {
    const nullableSchema = ZodSymbol().nullable();
    expectParseSuccess(nullableSchema, null);
    expectParseSuccess(nullableSchema, Symbol('null'));
    expectParseFailure(nullableSchema, undefined);
  });

  it('default() supplies a fallback Symbol when value is undefined', () => {
    const fallback = Symbol('fallback');
    const defaultSchema = ZodSymbol().default(fallback);
    // When value is undefined, parse returns the default
    expect(defaultSchema.parse(undefined)).toBe(fallback);
    // When a valid Symbol is supplied, it is returned unchanged
    const custom = Symbol('custom');
    expect(defaultSchema.parse(custom)).toBe(custom);
    // Invalid values still throw
    expectParseFailure(defaultSchema, 0);
  });

  it('describe() attaches a description (no functional impact)', () => {
    const described = ZodSymbol().describe('A symbol representing a user ID');
    // Description is stored on the schema; we can inspect it via ._def (internal)
    // but the public API does not expose it, so we just ensure parsing still works.
    expectParseSuccess(described, Symbol('desc'));
  });

  it('refine() can enforce custom constraints', () => {
    // Example: only allow symbols whose description starts with "id-"
    const refined = ZodSymbol().refine(
      (sym) => typeof sym.description === 'string' && sym.description.startsWith('id-'),
      { message: 'Symbol description must start with "id-".' }
    );

    const good = Symbol('id-123');
    const bad = Symbol('nope');

    expectParseSuccess(refined, good);
    expect(() => refined.parse(bad)).toThrowError(ZodError);
  });
});

describe('ZodSymbol – edge‑case handling', () => {
  it('handles Symbol objects created via Object(Symbol()) (should still be a Symbol)', () => {
    // `Object(Symbol())` returns a wrapper object, not a primitive Symbol.
    const wrapper = Object(Symbol('wrapped'));
    // ZodSymbol should reject the wrapper because it is not a primitive Symbol.
    expectParseFailure(ZodSymbol(), wrapper);
  });

  it('rejects Symbol-like objects with a `valueOf` returning a Symbol', () => {
    const fake = {
      valueOf: () => Symbol('fake')
    };
    expectParseFailure(ZodSymbol(), fake);
  });

  it('does not coerce other primitive types (e.g., stringified Symbol)', () => {
    const str = Symbol('a').toString(); // "Symbol(a)"
    expectParseFailure(ZodSymbol(), str);
  });
});
