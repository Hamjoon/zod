###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniPromise` schema.
 *
 * The tests are organised in the following sections:
 * 1️⃣  Extraction of public method signatures (documented in comments).
 * 2️⃣  Basic functionality tests for each public method.
 * 3️⃣  Edge‑case / exception handling tests.
 *
 * NOTE:
 * - The actual implementation of `ZodMiniPromise` lives in `./schemas.js`.
 * - The class is created via `core.$constructor`, therefore it behaves like a Zod
 *   schema constructor (similar to `z.promise(innerSchema)` in the official Zod library).
 * - For the purpose of these tests we use a very simple inner schema – the built‑in
 *   `ZodMiniString` – which is also exported from `./schemas.js`.  If the library
 *   does not expose a string schema you can replace it with any other minimal schema
 *   that implements the ZodMiniType interface.
 *
 * The test file is completely self‑contained and can be run with Vitest:
 *   npx vitest run ZodMiniPromise.test.ts
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniPromise, ZodMiniString } from './schemas.js';

// -----------------------------------------------------------------------------
// 1️⃣  Public method signatures (extracted from the ZodMiniPromise type)
// -----------------------------------------------------------------------------
//
// The `ZodMiniPromise<T>` schema (where `T` is the inner Zod type) exposes the
// following public methods (mirroring the official Zod API).  The signatures are
// written in TypeScript syntax for reference only – they are **not** imported
// from the library.
//
// ```ts
// // Core parsing methods
// parse(value: unknown, params?: ParseParams): Promise<T>
// safeParse(value: unknown, params?: ParseParams): Promise<ParseResult<T>>
//
// // Modifiers
// optional(): ZodOptional<ZodMiniPromise<T>>
// nullable(): ZodNullable<ZodMiniPromise<T>>
// nullish(): ZodNullable<ZodOptional<ZodMiniPromise<T>>>
// default(value: Promise<T>): ZodDefault<ZodMiniPromise<T>>
// catch(error: unknown): ZodMiniPromise<T>
//
// // Refinement & transformation
// refine(
//   check: (val: Promise<T>) => boolean | Promise<boolean>,
//   message?: string | ZodIssue
// ): this
// transform<Out>(
//   mapper: (val: Promise<T>) => Out | Promise<Out>
// ): ZodMiniPromise<Out>
//
// // Utility
// describe(description: string): this
// array(): ZodArray<ZodMiniPromise<T>>
// ```
//
// The test suite below validates the behaviour of each of these methods.


// -----------------------------------------------------------------------------
// Helper – a tiny inner schema (string) used for all tests
// -----------------------------------------------------------------------------
const InnerStringSchema = ZodMiniString(); // e.g. z.string() equivalent

// -----------------------------------------------------------------------------
// 2️⃣  Basic functionality tests
// -----------------------------------------------------------------------------
describe('ZodMiniPromise – basic API', () => {
  // -------------------------------------------------------------------------
  // Construction & method existence
  // -------------------------------------------------------------------------
  it('should create a ZodMiniPromise schema with the expected methods', () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    // Core parsing
    expect(typeof schema.parse).toBe('function');
    expect(typeof schema.safeParse).toBe('function');

    // Modifiers
    expect(typeof schema.optional).toBe('function');
    expect(typeof schema.nullable).toBe('function');
    expect(typeof schema.nullish).toBe('function');
    expect(typeof schema.default).toBe('function');
    expect(typeof schema.catch).toBe('function');

    // Refinement & transformation
    expect(typeof schema.refine).toBe('function');
    expect(typeof schema.transform).toBe('function');

    // Utility
    expect(typeof schema.describe).toBe('function');
    expect(typeof schema.array).toBe('function');
  });

  // -------------------------------------------------------------------------
  // parse / safeParse – happy path
  // -------------------------------------------------------------------------
  it('parse should resolve when given a valid Promise that resolves to a valid value', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    const validPromise = Promise.resolve('hello world');

    const result = await schema.parse(validPromise);
    expect(result).toBe('hello world');
  });

  it('safeParse should return a success result for a valid Promise', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    const validPromise = Promise.resolve('zod');

    const result = await schema.safeParse(validPromise);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('zod');
    }
  });

  // -------------------------------------------------------------------------
  // optional / nullable / nullish
  // -------------------------------------------------------------------------
  it('optional() should accept undefined without error', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).optional();
    const result = await schema.parse(undefined);
    expect(result).toBeUndefined();
  });

  it('nullable() should accept null without error', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).nullable();
    const result = await schema.parse(null);
    expect(result).toBeNull();
  });

  it('nullish() should accept both undefined and null', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).nullish();

    const resUndef = await schema.parse(undefined);
    expect(resUndef).toBeUndefined();

    const resNull = await schema.parse(null);
    expect(resNull).toBeNull();
  });

  // -------------------------------------------------------------------------
  // default()
  // -------------------------------------------------------------------------
  it('default() should replace undefined with the provided default Promise', async () => {
    const defaultPromise = Promise.resolve('default value');
    const schema = ZodMiniPromise(InnerStringSchema).default(defaultPromise);

    // Passing undefined triggers the default
    const result = await schema.parse(undefined);
    expect(result).toBe('default value');
  });

  // -------------------------------------------------------------------------
  // catch()
  // -------------------------------------------------------------------------
  it('catch() should replace a rejected Promise with the supplied fallback value', async () => {
    const fallback = Promise.resolve('fallback');
    const schema = ZodMiniPromise(InnerStringSchema).catch(fallback);

    const rejecting = Promise.reject(new Error('boom'));
    const result = await schema.parse(rejecting);
    expect(result).toBe('fallback');
  });

  // -------------------------------------------------------------------------
  // refine()
  // -------------------------------------------------------------------------
  it('refine() should allow custom validation on the resolved value', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).refine(
      async (val) => (await val).length > 5,
      { message: 'String must be longer than 5 characters' }
    );

    await expect(schema.parse(Promise.resolve('longer'))).resolves.toBe('longer');
    await expect(schema.parse(Promise.resolve('short'))).rejects.toThrow(
      'String must be longer than 5 characters'
    );
  });

  // -------------------------------------------------------------------------
  // transform()
  // -------------------------------------------------------------------------
  it('transform() should map the resolved value to a new type', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).transform((p) =>
      p.then((s) => s.length)
    );

    const result = await schema.parse(Promise.resolve('hello'));
    // The transformed schema now resolves to a number (the length)
    expect(result).toBe(5);
  });

  // -------------------------------------------------------------------------
  // describe()
  // -------------------------------------------------------------------------
  it('describe() should store the description without affecting parsing', async () => {
    const description = 'A promise that resolves to a string';
    const schema = ZodMiniPromise(InnerStringSchema).describe(description);

    // The description is an internal property; we just ensure the method is chainable
    expect(schema.describe).toBeInstanceOf(Function);
    const result = await schema.parse(Promise.resolve('desc'));
    expect(result).toBe('desc');
  });

  // -------------------------------------------------------------------------
  // array()
  // -------------------------------------------------------------------------
  it('array() should create a schema for an array of promises', async () => {
    const arraySchema = ZodMiniPromise(InnerStringSchema).array();

    const input = [Promise.resolve('a'), Promise.resolve('b')];
    const result = await arraySchema.parse(input);
    expect(result).toEqual(['a', 'b']);
  });
});

// -----------------------------------------------------------------------------
// 3️⃣  Edge‑case & exception handling tests
// -----------------------------------------------------------------------------
describe('ZodMiniPromise – edge cases & error handling', () => {
  // -------------------------------------------------------------------------
  // Passing a non‑Promise value
  // -------------------------------------------------------------------------
  it('parse should reject when the input is not a Promise', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    await expect(schema.parse('not a promise')).rejects.toThrow();
  });

  // -------------------------------------------------------------------------
  // Promise resolves to an invalid inner value
  // -------------------------------------------------------------------------
  it('parse should reject when the resolved value does not satisfy the inner schema', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    const badPromise = Promise.resolve(123); // number instead of string
    await expect(schema.parse(badPromise)).rejects.toThrow();
  });

  // -------------------------------------------------------------------------
  // safeParse should return a failure result for the above two cases
  // -------------------------------------------------------------------------
  it('safeParse should return failure for non‑Promise input', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    const result = await schema.safeParse('oops');
    expect(result.success).toBe(false);
  });

  it('safeParse should return failure when the inner value is invalid', async () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    const result = await schema.safeParse(Promise.resolve(42));
    expect(result.success).toBe(false);
  });

  // -------------------------------------------------------------------------
  // catch() with a non‑Promise fallback
  // -------------------------------------------------------------------------
  it('catch() should throw if the fallback is not a Promise', () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    // @ts-expect-error – intentionally passing a wrong type
    expect(() => schema.catch('not a promise')).toThrow();
  });

  // -------------------------------------------------------------------------
  // refine() throwing synchronously
  // -------------------------------------------------------------------------
  it('refine() should propagate synchronous errors thrown inside the check function', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).refine(() => {
      throw new Error('sync error');
    });

    await expect(schema.parse(Promise.resolve('any'))).rejects.toThrow('sync error');
  });

  // -------------------------------------------------------------------------
  // transform() returning a rejected Promise
  // -------------------------------------------------------------------------
  it('transform() should propagate a rejection from the mapper function', async () => {
    const schema = ZodMiniPromise(InnerStringSchema).transform(() =>
      Promise.reject(new Error('mapper failure'))
    );

    await expect(schema.parse(Promise.resolve('test'))).rejects.toThrow('mapper failure');
  });

  // -------------------------------------------------------------------------
  // default() with a non‑Promise value
  // -------------------------------------------------------------------------
  it('default() should throw if the provided default is not a Promise', () => {
    const schema = ZodMiniPromise(InnerStringSchema);
    // @ts-expect-error – intentionally wrong type
    expect(() => schema.default('not a promise')).toThrow();
  });

  // -------------------------------------------------------------------------
  // array() with non‑array input
  // -------------------------------------------------------------------------
  it('array() should reject when the input is not an array', async () => {
    const arraySchema = ZodMiniPromise(InnerStringSchema).array();
    await expect(arraySchema.parse(Promise.resolve('single'))).rejects.toThrow();
  });
});
```
###Test END##