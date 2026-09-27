/**
 * Vitest test suite for the `ZodSuccess` class.
 *
 * The class is exported from `./schemas.js` and has a single public method:
 *
 *   - `unwrap(): T`
 *
 * The constructor is a special Zod‑internal constructor (`core.$constructor`) that
 * expects a definition object containing an `innerType` property.  For the
 * purpose of these tests we only need to provide that property – the rest of
 * the Zod internals are mocked by the library itself.
 *
 * The tests cover:
 *   1. Basic functionality – `unwrap` returns the value supplied as `innerType`.
 *   2. Edge‑case values for `innerType` (primitive, object, array, `null`,
 *      `undefined`).
 *   3. Reference semantics (the returned value is the exact stored reference).
 *   4. Correct binding of the method when called with an explicit `this`.
 */

import { describe, it, expect } from 'vitest';
import { ZodSuccess } from './schemas.js';

/**
 * Helper to create a ZodSuccess instance with a given `innerType`.
 *
 * The Zod constructor expects a definition object that matches the internal
 * shape `core.$ZodSuccessInternals<T>`.  The only required field for our
 * tests is `innerType`.
 */
function createSuccess<T>(inner: T): ZodSuccess<T> {
  // The concrete type of the definition is not exported, but we know it must
  // contain `innerType`.  Any additional fields are ignored by the constructor.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – we are intentionally using a minimal definition.
  return new ZodSuccess({ innerType: inner });
}

describe('ZodSuccess', () => {
  /** -----------------------------------------------------------------------
   *  1️⃣  Basic functionality
   * ----------------------------------------------------------------------- */
  it('should return the inner value via unwrap()', () => {
    const value = 123;
    const success = createSuccess(value);
    expect(success.unwrap()).toBe(value);
  });

  /** -----------------------------------------------------------------------
   *  2️⃣  Edge‑case values for `innerType`
   * ----------------------------------------------------------------------- */
  it('should correctly unwrap a string', () => {
    const success = createSuccess('hello world');
    expect(success.unwrap()).toBe('hello world');
  });

  it('should correctly unwrap a boolean', () => {
    const success = createSuccess(true);
    expect(success.unwrap()).toBe(true);
  });

  it('should correctly unwrap `null`', () => {
    const success = createSuccess(null);
    expect(success.unwrap()).toBeNull();
  });

  it('should correctly unwrap `undefined`', () => {
    const success = createSuccess(undefined);
    expect(success.unwrap()).toBeUndefined();
  });

  it('should correctly unwrap an object (reference semantics)', () => {
    const obj = { a: 1, b: 'x' };
    const success = createSuccess(obj);
    expect(success.unwrap()).toBe(obj); // same reference
  });

  it('should correctly unwrap an array (reference semantics)', () => {
    const arr = [1, 2, 3];
    const success = createSuccess(arr);
    expect(success.unwrap()).toBe(arr); // same reference
  });

  /** -----------------------------------------------------------------------
   *  3️⃣  Reference semantics – mutating the returned value affects the stored one
   * ----------------------------------------------------------------------- */
  it('mutating the unwrapped object should affect the internal state', () => {
    const obj = { count: 0 };
    const success = createSuccess(obj);
    const unwrapped = success.unwrap();
    unwrapped.count = 42;
    // The internal `innerType` should now reflect the mutation.
    expect(success.unwrap().count).toBe(42);
  });

  /** -----------------------------------------------------------------------
   *  4️⃣  Method binding – calling `unwrap` with an explicit `this`
   * ----------------------------------------------------------------------- */
  it('should work when `unwrap` is called with an explicit this value', () => {
    const inner = { secret: 'value' };
    const success = createSuccess(inner);
    // Extract the method and invoke it with `call`.
    const result = ZodSuccess.prototype.unwrap.call(success);
    expect(result).toBe(inner);
  });

  /** -----------------------------------------------------------------------
   *  5️⃣  Defensive test – if the internal definition is missing `innerType`,
   *       `unwrap` returns `undefined` (no exception is thrown).
   * ----------------------------------------------------------------------- */
  it('returns undefined when the internal definition lacks `innerType`', () => {
    // Construct a raw instance without using the helper so we can omit the field.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – intentionally creating a malformed definition.
    const malformed = new ZodSuccess({});
    expect(malformed.unwrap()).toBeUndefined();
  });
});
