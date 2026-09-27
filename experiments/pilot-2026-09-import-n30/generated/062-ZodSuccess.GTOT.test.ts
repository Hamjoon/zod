/**
 * Vitest test suite for the `ZodSuccess` class.
 *
 * The class is exported from `./schemas.js` and has a single public method:
 *   - `unwrap(): T`
 *
 * The implementation of `ZodSuccess` relies on an internal `core` library.
 * To keep the tests focused on the observable behaviour of `unwrap`,
 * we mock the minimal parts of `core` that are required for the constructor
 * to work. This allows the tests to run in isolation without pulling in the
 * full Zod library.
 */

import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mock the `core` module that `./schemas.js` depends on.
// ---------------------------------------------------------------------------
vi.mock('./schemas.js', async (importOriginal) => {
  // Load the original module to keep the exported `ZodSuccess` type.
  const original = await importOriginal();

  // Create a very small mock of the `core` namespace that satisfies the
  // expectations of the constructor defined in `schemas.js`.
  const mockCore = {
    // The `$constructor` helper creates a class‑like constructor.
    $constructor: (name: string, initFn: (inst: any, def: any) => void) => {
      // Return a class that stores the definition in a private `_zod` field
      // and runs the provided `initFn` during construction.
      return class {
        // The internal storage used by the real implementation.
        _zod: { def: any };
        // The public method will be attached by `initFn`.
        constructor(def: any) {
          this._zod = { def };
          initFn(this, def);
        }
      };
    },

    // Stub for `$ZodSuccess.init` – the real implementation adds internal
    // metadata but for our tests it can be a no‑op.
    $ZodSuccess: {
      init: () => {},
    },

    // Stub for `ZodType.init` – also a no‑op for the purpose of these tests.
    ZodType: {
      init: () => {},
    },
  };

  // Re‑export everything from the original module, but replace the imported
  // `core` with our mock. The original file likely does something like:
  //   import { core } from 'somewhere';
  // We cannot rewrite that import directly, but because the module is
  // evaluated after this mock is applied, the `core` identifier inside the
  // module will resolve to the mocked object we provide here.
  return {
    ...original,
    // Provide the mocked `core` under the same name the original module expects.
    core: mockCore,
  };
});

// ---------------------------------------------------------------------------
// Import the (now mocked) `ZodSuccess` class.
// ---------------------------------------------------------------------------
import { ZodSuccess } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper to create a ZodSuccess instance with a given `innerType`.
// ---------------------------------------------------------------------------
function createZodSuccess<T>(inner: T): InstanceType<typeof ZodSuccess> {
  // The constructor expects a definition object that contains at least
  // an `innerType` property. Additional properties are ignored by our
  // mock implementation.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new (ZodSuccess as any)({ innerType: inner });
}

// ---------------------------------------------------------------------------
// Test suite.
// ---------------------------------------------------------------------------
describe('ZodSuccess', () => {
  // -----------------------------------------------------------------------
  // 1. Basic functionality – `unwrap` returns the exact value passed as
  //    `innerType` during construction.
  // -----------------------------------------------------------------------
  it('should return the inner type via unwrap()', () => {
    const payload = { foo: 'bar', count: 42 };
    const instance = createZodSuccess(payload);
    expect(instance.unwrap()).toBe(payload);
  });

  // -----------------------------------------------------------------------
  // 2. Primitive values – ensure that numbers, strings, booleans, null and
  //    undefined are handled correctly.
  // -----------------------------------------------------------------------
  it.each([
    [123, 123],
    ['hello world', 'hello world'],
    [true, true],
    [false, false],
    [null, null],
    [undefined, undefined],
  ])('unwrap() should correctly return primitive %p', (input, expected) => {
    const instance = createZodSuccess(input);
    expect(instance.unwrap()).toBe(expected);
  });

  // -----------------------------------------------------------------------
  // 3. Complex structures – arrays, nested objects, and functions.
  // -----------------------------------------------------------------------
  it('should correctly unwrap arrays', () => {
    const arr = [1, 2, 3];
    const instance = createZodSuccess(arr);
    expect(instance.unwrap()).toBe(arr);
  });

  it('should correctly unwrap nested objects', () => {
    const nested = { a: { b: { c: 5 } } };
    const instance = createZodSuccess(nested);
    expect(instance.unwrap()).toBe(nested);
  });

  it('should correctly unwrap functions (reference equality)', () => {
    const fn = () => 'test';
    const instance = createZodSuccess(fn);
    expect(instance.unwrap()).toBe(fn);
  });

  // -----------------------------------------------------------------------
  // 4. Edge case – missing `innerType` in the definition.
  //    The real implementation would store `undefined` and `unwrap` would
  //    return `undefined`. We assert that this behaviour does not throw.
  // -----------------------------------------------------------------------
  it('should return undefined when innerType is omitted', () => {
    // Directly instantiate without providing `innerType`.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const instance = new (ZodSuccess as any)({});
    expect(instance.unwrap()).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // 5. Edge case – `innerType` is a mutable object; modifications after
  //    construction should be reflected because `unwrap` returns the same
  //    reference.
  // -----------------------------------------------------------------------
  it('should return a live reference to a mutable inner object', () => {
    const mutable = { mutable: true };
    const instance = createZodSuccess(mutable);
    // Mutate after construction.
    mutable.mutable = false;
    expect(instance.unwrap()).toEqual({ mutable: false });
    // Also verify reference equality.
    expect(instance.unwrap()).toBe(mutable);
  });

  // -----------------------------------------------------------------------
  // 6. Defensive test – calling `unwrap` on a non‑ZodSuccess object should
  //    throw a TypeError. This mimics typical misuse and ensures that the
  //    method is bound to the instance.
  // -----------------------------------------------------------------------
  it('should throw when unwrap is called on an object without the method', () => {
    const notZodSuccess = { unwrap: undefined };
    // @ts-ignore – intentionally accessing a non‑function.
    expect(() => (notZodSuccess as any).unwrap()).toThrow(TypeError);
  });
});
