**ZodNull.test.ts**

```ts
###Test START##
import { describe, it, expect } from 'vitest';
import { ZodNull } from './schemas.js';
import { ZodError } from 'zod';

/**
 * The `ZodNull` export is a **constructor** that creates a Zod schema
 * which validates that a value is exactly `null`.  The underlying
 * implementation lives in `core.$ZodNull` and `ZodType`, but from a
 * consumer’s point‑of‑view the public API is the same as any other Zod
 * schema: `.parse`, `.safeParse`, etc.
 *
 * The test suite below covers:
 *   • Typical use‑case – parsing a valid `null`.
 *   • Edge‑cases – `undefined` and every other primitive / object type.
 *   • Error handling – that a `ZodError` is thrown / returned with a
 *     meaningful message.
 *   • Internal contract – the schema’s definition contains the expected
 *     `typeName` (`'ZodNull'`).
 *   • Type‑guard – the created schema is an instance of the generic
 *     `ZodType` base class.
 */

describe('ZodNull schema', () => {
  // Zod schemas are created by *calling* the exported constructor.
  const schema = ZodNull();

  /*** 1️⃣ Typical use‑case ***/
  it('parses `null` successfully', () => {
    // `.parse` should return the exact value it received.
    expect(schema.parse(null)).toBe(null);
  });

  /*** 2️⃣ Safe‑parse success path ***/
  it('safeParse returns a successful result for `null`', () => {
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      // The data field must be the original `null`.
      expect(result.data).toBe(null);
    }
  });

  /*** 3️⃣ Edge‑case: `undefined` ***/
  it('rejects `undefined`', () => {
    // `.parse` must throw a ZodError for any value that isn’t `null`.
    expect(() => schema.parse(undefined)).toThrow(ZodError);
  });

  /*** 4️⃣ Edge‑case: all non‑null primitives & objects ***/
  it('rejects every non‑null value', () => {
    const nonNullValues = [
      0,
      42,
      -7,
      3.14,
      '',
      'string',
      true,
      false,
      Symbol('sym'),
      {},
      { a: 1 },
      [],
      [null],
      () => null,
      new Date(),
      /regex/,
    ];

    nonNullValues.forEach((val) => {
      expect(() => schema.parse(val as any)).toThrow(ZodError);
    });
  });

  /*** 5️⃣ Error scenario: verify error shape ***/
  it('safeParse returns a failure with a helpful message for non‑null values', () => {
    const result = schema.safeParse(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      // ZodError always contains an `errors` array; the first message
      // should mention that `null` was expected.
      const firstMsg = result.error.errors[0].message;
      expect(firstMsg).toContain('null');
    }
  });

  /*** 6️⃣ Internal contract: definition typeName ***/
  it('has the correct internal definition typeName', () => {
    // The internal `_def` property is part of Zod’s public contract.
    // It should expose `typeName: 'ZodNull'`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const def = (schema as any)._def;
    expect(def).toBeDefined();
    expect(def.typeName).toBe('ZodNull');
  });

  /*** 7️⃣ Type‑guard: instance of ZodType ***/
  it('is an instance of the generic ZodType base class', () => {
    // The base class lives in `zod` and all schemas inherit from it.
    // We can check the prototype chain via `instanceof`.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ZodType } = require('zod');
    expect(schema).toBeInstanceOf(ZodType);
  });
});
###Test END##
```