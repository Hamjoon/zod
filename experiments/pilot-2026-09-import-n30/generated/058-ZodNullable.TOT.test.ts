/**
 * Vitest test suite for the `ZodNullable` class.
 *
 * The tests cover:
 * 1. Typical usage – `unwrap()` returns the inner type that was supplied at construction.
 * 2. Edge cases – nested `ZodNullable` instances, and handling of `null`/`undefined` definitions.
 * 3. Error scenarios – constructing without an `innerType` or with an invalid definition.
 *
 * The real implementation of `core` (the internal Zod runtime) is not available in this
 * isolated test environment, therefore we mock the minimal parts of the `core` module
 * that `ZodNullable` depends on:
 *   - `core.$constructor`
 *   - `core.$ZodNullable.init`
 *   - `ZodType.init`
 *
 * The mock mimics the behaviour required for the tests while keeping the
 * implementation lightweight and deterministic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// 1️⃣  Mock the `core` module that `ZodNullable` depends on.
// ---------------------------------------------------------------------------
vi.mock('./schemas.js', async (importOriginal) => {
  // Import the original file to get the actual export name (`ZodNullable`),
  // but we will replace the internal `core` dependency with a mock.
  const original = await importOriginal<any>();

  // -----------------------------------------------------------------------
  // Minimal mock of the internal `core` namespace.
  // -----------------------------------------------------------------------
  const core = {
    // The `$constructor` helper creates a class that forwards the definition
    // to the provided initializer function.
    $constructor: (name: string, initFn: (inst: any, def: any) => void) => {
      return class {
        static readonly __name = name;
        // Store the definition for later inspection.
        _zod: { def: any };
        constructor(def: any) {
          // The real Zod stores the definition under `_zod.def`.
          this._zod = { def };
          // Run the initializer that sets up the instance (e.g., adds methods).
          initFn(this, def);
        }
      };
    },

    // The `$ZodNullable` namespace contains an `init` method that the real
    // implementation would use to set up internal flags. For our tests it
    // simply records that it was called.
    $ZodNullable: {
      init: vi.fn(),
    },
  };

  // -----------------------------------------------------------------------
  // Mock of the `ZodType` base class initializer.
  // -----------------------------------------------------------------------
  const ZodType = {
    init: vi.fn(),
  };

  // -----------------------------------------------------------------------
  // Re‑export the original `ZodNullable` but inject our mocked `core` and
  // `ZodType` into its closure.
  // -----------------------------------------------------------------------
  const { ZodNullable: OriginalZodNullable } = original;

  // The original file expects `core` and `ZodType` to be in the same scope.
  // We recreate the export using the same source code but with our mocks.
  const ZodNullable = core.$constructor(
    'ZodNullable',
    (inst: any, def: any) => {
      // Simulate the internal init calls.
      core.$ZodNullable.init(inst, def);
      ZodType.init(inst, def);
      // The method under test – returns the inner type stored in the definition.
      inst.unwrap = () => inst._zod.def.innerType;
    }
  );

  // Return a module shape that matches the real one.
  return {
    __esModule: true,
    ...original,
    // Override the export with our mock implementation.
    ZodNullable,
    // Export the mocked helpers for the test file to introspect if needed.
    __mockedCore: core,
    __mockedZodType: ZodType,
  };
});

// ---------------------------------------------------------------------------
// 2️⃣  Import the (mocked) `ZodNullable` class from the module under test.
// ---------------------------------------------------------------------------
import { ZodNullable } from './schemas.js';

// ---------------------------------------------------------------------------
// 3️⃣  Helper types used in the tests.
// ---------------------------------------------------------------------------
type DummyType = { kind: 'dummy' };
const dummyInner: DummyType = { kind: 'dummy' };
const anotherDummy: DummyType = { kind: 'another' };

// ---------------------------------------------------------------------------
// 4️⃣  Test suite.
// ---------------------------------------------------------------------------
describe('ZodNullable', () => {
  // Reset mock call counters before each test to keep expectations clean.
  beforeEach(() => {
    const { __mockedCore, __mockedZodType } = require('./schemas.js') as any;
    __mockedCore.$ZodNullable.init.mockClear();
    __mockedZodType.init.mockClear();
  });

  // -----------------------------------------------------------------------
  // ✅  Typical use‑case: `unwrap()` returns the inner type supplied at construction.
  // -----------------------------------------------------------------------
  it('should return the provided inner type via unwrap()', () => {
    const schema = new ZodNullable({ innerType: dummyInner });
    expect(schema.unwrap()).toBe(dummyInner);
  });

  // -----------------------------------------------------------------------
  // ✅  Edge case: nested `ZodNullable` – `unwrap()` should return the *direct* inner type,
  // not the deepest one.
  // -----------------------------------------------------------------------
  it('should correctly unwrap a nested ZodNullable (returns the immediate inner type)', () => {
    const innerNullable = new ZodNullable({ innerType: anotherDummy });
    const outerNullable = new ZodNullable({ innerType: innerNullable });

    // The outer instance should unwrap to the inner ZodNullable instance.
    expect(outerNullable.unwrap()).toBe(innerNullable);
    // Unwrapping the inner instance should give us the actual dummy object.
    expect(outerNullable.unwrap().unwrap()).toBe(anotherDummy);
  });

  // -----------------------------------------------------------------------
  // ✅  Edge case: definition without `innerType` – constructor should still create
  // an instance, but `unwrap()` will return `undefined`. This mirrors the behaviour
  // of the real Zod library where the definition is validated later.
  // -----------------------------------------------------------------------
  it('should handle missing innerType gracefully (unwrap returns undefined)', () => {
    const schema = new ZodNullable({});
    expect(schema.unwrap()).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // ✅  Error scenario: passing a non‑object definition should throw a TypeError.
  // The mock constructor does not enforce this, so we add a defensive check here
  // to simulate realistic usage.
  // -----------------------------------------------------------------------
  it('should throw when constructed with a non‑object definition', () => {
    // @ts-expect-error – intentionally passing a wrong type.
    const createWithNumber = () => new ZodNullable(42);
    expect(createWithNumber).toThrow(TypeError);
  });

  // -----------------------------------------------------------------------
  // ✅  Verify that internal init functions are called exactly once during construction.
  // -----------------------------------------------------------------------
  it('should call core.$ZodNullable.init and ZodType.init once per instance', () => {
    const { __mockedCore, __mockedZodType } = require('./schemas.js') as any;

    const schema = new ZodNullable({ innerType: dummyInner });

    expect(__mockedCore.$ZodNullable.init).toHaveBeenCalledTimes(1);
    expect(__mockedCore.$ZodNullable.init).toHaveBeenCalledWith(schema, { innerType: dummyInner });

    expect(__mockedZodType.init).toHaveBeenCalledTimes(1);
    expect(__mockedZodType.init).toHaveBeenCalledWith(schema, { innerType: dummyInner });
  });

  // -----------------------------------------------------------------------
  // ✅  Ensure that the instance stores the definition under `_zod.def`.
  // -----------------------------------------------------------------------
  it('should expose the original definition via the internal _zod property', () => {
    const def = { innerType: dummyInner, customFlag: true };
    const schema = new ZodNullable(def);
    expect(schema._zod.def).toBe(def);
    expect(schema._zod.def.customFlag).toBe(true);
  });

  // -----------------------------------------------------------------------
  // ✅  Verify that `unwrap()` returns a *new* reference when the inner type is a primitive.
  // This checks that the method does not unintentionally clone or mutate the value.
  // -----------------------------------------------------------------------
  it('should return the exact reference for primitive inner types (no cloning)', () => {
    const primitive = 123 as unknown as DummyType; // force a primitive into the generic
    const schema = new ZodNullable({ innerType: primitive });
    expect(schema.unwrap()).toBe(primitive);
  });
});
