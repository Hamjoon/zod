###Test START##
```ts
/**
 * Vitest test suite for the `ZodNull` schema.
 *
 * The tests cover:
 * 1. Successful parsing of `null`.
 * 2. Rejection of any non‑null value (including `undefined`).
 * 3. The shape of the error object returned by `safeParse`.
 * 4. Type‑guard behaviour (`instanceof ZodType`).
 * 5. Integration with Zod's `refine` and `default` helpers (edge‑case usage).
 *
 * The suite assumes that the library exposing `ZodNull` follows the same
 * public API contract as the official Zod package (i.e. `parse`,
 * `safeParse`, `check`, `is`, etc.). Adjust import paths if your project
 * structure differs.
 */

import { describe, it, expect } from 'vitest';
import { ZodNull, ZodError, ZodType } from './ZodNull'; // adjust path as needed

describe('ZodNull schema', () => {
  /** --------------------------------------------------------------------
   *  1️⃣  Basic happy‑path: parsing `null` should succeed and return `null`.
   * -------------------------------------------------------------------- */
  it('parses null successfully', () => {
    const schema = ZodNull();
    const result = schema.parse(null);
    expect(result).toBeNull();
  });

  /** --------------------------------------------------------------------
   *  2️⃣  Reject every non‑null value.
   * -------------------------------------------------------------------- */
  const nonNullValues = [
    undefined,
    true,
    false,
    0,
    42,
    '',
    'string',
    [],
    [null],
    {},
    { a: null },
    Symbol('sym'),
    () => null,
  ];

  nonNullValues.forEach((value) => {
    it(`throws when parsing non‑null value: ${String(value)}`, () => {
      const schema = ZodNull();
      expect(() => schema.parse(value as any)).toThrowError(ZodError);
    });
  });

  /** --------------------------------------------------------------------
   *  3️⃣  `safeParse` should return a failure object with a proper error shape.
   * -------------------------------------------------------------------- */
  it('safeParse returns failure for non‑null and contains correct error path', () => {
    const schema = ZodNull();
    const { success, error } = schema.safeParse('not null');

    expect(success).toBe(false);
    // `error` is a ZodError; its `issues` array should contain exactly one issue.
    expect(error).toBeInstanceOf(ZodError);
    expect(error.issues).toHaveLength(1);
    const issue = error.issues[0];
    expect(issue.code).toBe('invalid_type'); // Zod's default code for type mismatch
    expect(issue.expected).toBe('null');
    expect(issue.received).toBe('string');
    expect(issue.path).toEqual([]); // top‑level schema, no nested path
  });

  /** --------------------------------------------------------------------
   *  4️⃣  Verify that the schema is an instance of the base `ZodType`.
   * -------------------------------------------------------------------- */
  it('is an instance of ZodType', () => {
    const schema = ZodNull();
    expect(schema).toBeInstanceOf(ZodType);
  });

  /** --------------------------------------------------------------------
   *  5️⃣  Edge‑case usage: chaining with `default` and `refine`.
   *
   *  - `default` should never be applied because the schema only accepts `null`.
   *  - `refine` can be used to add a custom message; the message should surface.
   * -------------------------------------------------------------------- */
  it('works with default (should never be used) and refine (custom error)', () => {
    // `default` is a no‑op for ZodNull because `null` is already the only valid value.
    const schemaWithDefault = ZodNull().default('fallback');
    expect(schemaWithDefault.parse(null)).toBeNull();

    // Adding a refine that always fails to test custom error propagation.
    const schemaWithRefine = ZodNull().refine(() => false, {
      message: 'Custom null validation failed',
    });

    const result = schemaWithRefine.safeParse(null);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Custom null validation failed');
  });
});
```
###Test END##