/**
 * Vitest test suite for the `ZodMiniLazy` “class”.
 *
 * The original source only exports a *constructor* created by `core.$constructor`
 * and does **not** declare any public methods directly on the exported value.
 * All public behaviour therefore comes from the underlying implementation
 * (`core.$ZodLazy.init`, `ZodMiniType.init`, etc.).  Because those implementations
 * are part of the private `core` library we cannot test their internals here,
 * but we can verify that the exported constructor:
 *
 * 1. Exists and is a function.
 * 2. Calls the internal initializer functions with the correct arguments.
 * 3. Handles edge‑cases such as missing or malformed definitions.
 *
 * The test suite therefore focuses on the *public contract* of the exported
 * `ZodMiniLazy` value – i.e. that it can be invoked as a constructor and that
 * it behaves predictably when given valid or invalid inputs.
 *
 * The `core` module is fully mocked so that we can assert that the internal
 * init functions are called exactly once with the expected parameters.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// 1️⃣  Mock the `core` module that provides the low‑level helpers used by
//     `ZodMiniLazy`.  The mock implements the minimal API required for the
//     constructor to run without throwing.
// ---------------------------------------------------------------------------
vi.mock('./core', () => {
  // Helper to capture calls for later assertions
  const initCalls: Array<{ inst: unknown; def: unknown }> = [];

  return {
    // The `$constructor` helper returns a function that mimics a class
    // constructor.  It stores the received `inst` and `def` arguments
    // and forwards them to the provided initializer callbacks.
    $constructor: (name: string, initFn: (inst: any, def: any) => void) => {
      // The returned function is the “class” that users will `new`.
      const Ctor = function (def: any) {
        // `inst` is the newly created object (`this`).
        initFn(this, def);
      };
      // Preserve the name for debugging / stack‑traces.
      Object.defineProperty(Ctor, 'name', { value: name });
      return Ctor as unknown as typeof ZodMiniLazy;
    },

    // Mock of the `$ZodLazy` namespace with an `init` method.
    $ZodLazy: {
      init: vi.fn((inst: any, def: any) => {
        initCalls.push({ inst, def });
      }),
    },

    // Mock of the `ZodMiniType` namespace with an `init` method.
    ZodMiniType: {
      init: vi.fn((inst: any, def: any) => {
        initCalls.push({ inst, def });
      }),
    },

    // Export the captured calls so the test can inspect them.
    __mock__: {
      getInitCalls: () => initCalls.slice(),
      clearCalls: () => initCalls.splice(0),
    },

    // Export a dummy `$ZodType` to satisfy the generic constraint.
    $ZodType: class {},
  };
});

// ---------------------------------------------------------------------------
// 2️⃣  Import the mocked `core` utilities and the `ZodMiniLazy` export.
// ---------------------------------------------------------------------------
import * as core from './core';
import { ZodMiniLazy } from './ZodMiniLazy';

// ---------------------------------------------------------------------------
// 3️⃣  Helper to reset mock state before each test.
// ---------------------------------------------------------------------------
beforeEach(() => {
  // Reset call history of the mocked init functions.
  (core.$ZodLazy.init as any).mockClear();
  (core.ZodMiniType.init as any).mockClear();
  core.__mock__.clearCalls();
});

// ---------------------------------------------------------------------------
// 4️⃣  Public API extraction – there are **no** explicit methods on the
//     exported value, only the constructor itself.  For documentation purposes
//     we list the “signature” that users interact with:
//
//        new ZodMiniLazy(def: SomeDefinition): ZodMiniLazyInstance
//
//     where `def` is the lazy schema definition expected by the underlying
//     Zod implementation.
// ---------------------------------------------------------------------------

describe('ZodMiniLazy – public contract', () => {
  // -----------------------------------------------------------------------
  // ✅  Basic sanity checks
  // -----------------------------------------------------------------------
  it('should be defined and be a function (constructor)', () => {
    expect(ZodMiniLazy).toBeDefined();
    expect(typeof ZodMiniLazy).toBe('function');
    // The constructor name should be preserved by the mock.
    expect(ZodMiniLazy.name).toBe('ZodMiniLazy');
  });

  // -----------------------------------------------------------------------
  // ✅  Successful construction with a valid definition
  // -----------------------------------------------------------------------
  it('should create an instance and call internal init functions with the definition', () => {
    // A minimal, valid lazy definition – in real Zod this would be a function
    // returning a schema, but for our mock any object works.
    const lazyDef = { lazy: true };

    // `new` is used because the mock `$constructor` returns a class‑like function.
    const instance = new (ZodMiniLazy as any)(lazyDef);

    // The instance should be an object (the mock does not add properties).
    expect(instance).toBeInstanceOf(Object);

    // Both internal init functions must have been called exactly once.
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.ZodMiniType.init).toHaveBeenCalledTimes(1);

    // Verify that they received the same `inst` (the created object) and the
    // definition we passed.
    const [firstCall] = core.__mock__.getInitCalls();
    expect(firstCall.inst).toBe(instance);
    expect(firstCall.def).toBe(lazyDef);
  });

  // -----------------------------------------------------------------------
  // ⚠️  Edge‑case: missing definition (undefined)
  // -----------------------------------------------------------------------
  it('should still construct when definition is undefined (edge case)', () => {
    // Passing `undefined` mimics a user forgetting to supply a schema.
    const instance = new (ZodMiniLazy as any)(undefined);

    expect(instance).toBeInstanceOf(Object);
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.ZodMiniType.init).toHaveBeenCalledTimes(1);

    const [{ def }] = core.__mock__.getInitCalls();
    // The internal init functions receive `undefined` as the definition.
    expect(def).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // ⚠️  Edge‑case: definition is not an object (e.g., a number)
  // -----------------------------------------------------------------------
  it('should forward non‑object definitions without throwing', () => {
    const badDef = 42; // any non‑object value
    const instance = new (ZodMiniLazy as any)(badDef);

    expect(instance).toBeInstanceOf(Object);
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.ZodMiniType.init).toHaveBeenCalledTimes(1);

    const [{ def }] = core.__mock__.getInitCalls();
    expect(def).toBe(badDef);
  });

  // -----------------------------------------------------------------------
  // 🛑  Exception handling – constructor called without `new`
  // -----------------------------------------------------------------------
  it('should still work when called as a regular function (without `new`)', () => {
    // The mock `$constructor` returns a function that does not enforce `new`,
    // but we explicitly test the behaviour.
    const lazyDef = { lazy: true };
    // @ts-ignore – intentionally calling without `new`
    const instance = (ZodMiniLazy as any)(lazyDef);

    // In our mock implementation `this` will be `undefined` (strict mode),
    // so the init functions receive `undefined` as `inst`.  This is an
    // important edge case to document.
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.ZodMiniType.init).toHaveBeenCalledTimes(1);

    const [{ inst, def }] = core.__mock__.getInitCalls();
    expect(inst).toBeUndefined(); // because no `new` was used
    expect(def).toBe(lazyDef);
  });

  // -----------------------------------------------------------------------
  // 🛑  Exception handling – passing a non‑function as the definition when the
  //     underlying Zod expects a function (lazy schemas are usually functions).
  // -----------------------------------------------------------------------
  it('should forward a non‑function definition; real Zod would later throw on use', () => {
    const nonFuncDef = { notAFunction: true };
    const instance = new (ZodMiniLazy as any)(nonFuncDef);

    expect(instance).toBeInstanceOf(Object);
    // The constructor itself does not validate the shape, so init functions are
    // still called.
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.ZodMiniType.init).toHaveBeenCalledTimes(1);
    const [{ def }] = core.__mock__.getInitCalls();
    expect(def).toBe(nonFuncDef);
  });
});
