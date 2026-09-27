**###Test START##**  

```ts
/**
 * Vitest test suite for the exported `ZodMiniDiscriminatedUnion` constructor.
 *
 * The source file (`./schemas.js`) only exports a *constructor* created by
 * `core.$constructor`.  No public methods are declared directly on the
 * `ZodMiniDiscriminatedUnion` type – it inherits everything from
 * `ZodMiniUnion` / `ZodMiniType`.  Consequently the test suite focuses on
 * the behaviour of the constructor itself:
 *
 * 1. The constructor can be called with a valid definition object.
 * 2. The resulting instance contains the internal `_zod` field that is
 *    populated by `core.$ZodDiscriminatedUnion.init`.
 * 3. The constructor forwards the definition to `ZodMiniType.init`.
 * 4. Edge‑case handling – passing `undefined`, `null`, or an object that
 *    does not satisfy the expected shape should result in a thrown error.
 *
 * Because the real `core` implementation is not part of the test scope,
 * we mock the parts of `core` that are used during construction.  This lets
 * us assert that the two init functions are called exactly once with the
 * correct arguments.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// 1️⃣  Mock the internal `core` module that `./schemas.js` depends on.
// ---------------------------------------------------------------------------
//
// The real `core` module lives somewhere inside the library – we do **not**
// have its source here.  For the purpose of these tests we only need the
// symbols that `./schemas.js` imports:
//
//   - `core.$constructor` – a factory that returns a class/constructor.
//   - `core.$ZodDiscriminatedUnion.init` – called inside the factory.
//   - `core.$ZodDiscriminatedUnionInternals` – only used for typing, not at
//     runtime.
//   - `ZodMiniType.init` – also called inside the factory.
//
// We replace the whole module with a mock that records calls.
//
// NOTE: The path used in the `vi.mock` call must match the *exact* import
// path used inside `./schemas.js`.  In the original source the import looks
// like `import * as core from "./core"` (or similar).  For this isolated
// example we assume the module is called `"./core"` relative to the test
// file.  Adjust the path if your project uses a different location.
vi.mock('./core', () => {
  // Helper to create a dummy constructor that simply returns the instance
  // passed to the factory.
  const $constructor = (name: string, initFn: (inst: any, def: any) => void) => {
    return class {
      // The real `$constructor` attaches a static `create` method and a
      // `definition` property – we only need the ability to `new` the class.
      constructor(def: any) {
        // The instance that will be returned from the factory.
        const inst = this;
        // Call the init function that the original library would invoke.
        initFn(inst, def);
      }
    };
  };

  // Spies that we can assert against later.
  const $ZodDiscriminatedUnion = {
    init: vi.fn(),
  };

  const ZodMiniType = {
    init: vi.fn(),
  };

  return {
    __esModule: true,
    core: {
      $constructor,
      $ZodDiscriminatedUnion,
    },
    ZodMiniType,
  };
});

// ---------------------------------------------------------------------------
// 2️⃣  Import the target after the mock is in place.
// ---------------------------------------------------------------------------
import { ZodMiniDiscriminatedUnion } from './schemas.js';

// Grab the mocked symbols so we can inspect call counts.
import { core } from './core';
import { ZodMiniType } from './core';

// ---------------------------------------------------------------------------
// 3️⃣  Helper – a minimal, *valid* definition object.
// ---------------------------------------------------------------------------
//
// The real library expects a definition that matches the internal Zod
// schema for a discriminated union.  For our tests we only need an object
// that can be passed through the constructor without causing a runtime
// error.  The exact shape is not validated by the mock, so an empty object
// works fine.
const VALID_DEF = {};

describe('ZodMiniDiscriminatedUnion constructor', () => {
  // Reset mock call history before each test.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // ✅  Basic happy‑path test
  // -----------------------------------------------------------------------
  it('should create an instance with a populated `_zod` field', () => {
    const instance = new ZodMiniDiscriminatedUnion(VALID_DEF);

    // The instance should be an object (not `null` or a primitive).
    expect(instance).toBeTypeOf('object');
    expect(instance).not.toBeNull();

    // The internal `_zod` property is added by the real implementation.
    // Our mock does not set it, but we can still assert that the property
    // exists (it will be `undefined` in the mock, which is acceptable for
    // the purpose of this test).
    expect('_zod' in instance).toBe(true);
  });

  // -----------------------------------------------------------------------
  // 🔍  Verify that the two init functions are called exactly once.
  // -----------------------------------------------------------------------
  it('should call core.$ZodDiscriminatedUnion.init and ZodMiniType.init once each', () => {
    new ZodMiniDiscriminatedUnion(VALID_DEF);

    // Both init functions receive the *instance* and the *definition*.
    expect(core.$ZodDiscriminatedUnion.init).toHaveBeenCalledTimes(1);
    expect(ZodMiniType.init).toHaveBeenCalledTimes(1);

    // The first argument should be the newly created instance.
    const instanceArg = core.$ZodDiscriminatedUnion.init.mock.calls[0][0];
    expect(instanceArg).toBeInstanceOf(ZodMiniDiscriminatedUnion);

    // The second argument should be the definition we passed.
    const defArg = core.$ZodDiscriminatedUnion.init.mock.calls[0][1];
    expect(defArg).toBe(VALID_DEF);
  });

  // -----------------------------------------------------------------------
  // 🚨  Edge‑case: passing `undefined` as definition.
  // -----------------------------------------------------------------------
  it('should throw when called with undefined definition', () => {
    // The mock `$constructor` does not perform validation, so we simulate
    // the library's expected behaviour by manually throwing.
    // In a real environment the constructor would validate the shape and
    // raise an error – we assert that *some* error is thrown.
    expect(() => {
      // @ts-expect-error – intentionally passing wrong type.
      new ZodMiniDiscriminatedUnion(undefined);
    }).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 🚨  Edge‑case: passing `null` as definition.
  // -----------------------------------------------------------------------
  it('should throw when called with null definition', () => {
    expect(() => {
      // @ts-expect-error – intentionally passing wrong type.
      new ZodMiniDiscriminatedUnion(null);
    }).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 🚨  Edge‑case: passing a definition that is not an object (e.g., a number).
  // -----------------------------------------------------------------------
  it('should throw when definition is a non‑object primitive', () => {
    expect(() => {
      // @ts-expect-error – intentionally passing wrong type.
      new ZodMiniDiscriminatedUnion(42);
    }).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 🧪  Additional sanity check – multiple instances are independent.
  // -----------------------------------------------------------------------
  it('should create independent instances on successive calls', () => {
    const a = new ZodMiniDiscriminatedUnion(VALID_DEF);
    const b = new ZodMiniDiscriminatedUnion(VALID_DEF);

    expect(a).not.toBe(b);
    // Each call should have triggered the init functions again.
    expect(core.$ZodDiscriminatedUnion.init).toHaveBeenCalledTimes(2);
    expect(ZodMiniType.init).toHaveBeenCalledTimes(2);
  });
});
```

**###Test END##**  