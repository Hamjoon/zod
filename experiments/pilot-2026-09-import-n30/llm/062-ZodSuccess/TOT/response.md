**ZodSuccess.test.ts**

```ts
###Test START##
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * The production file exports the `ZodSuccess` constructor from
 * `./schemas.js`.  Inside that module the implementation relies on a
 * `core` module that provides `$ZodSuccess`, `ZodType` and `$constructor`.
 *
 * For the purpose of unit‑testing we replace the real `core` with a tiny
 * mock that records how it is used and supplies the minimal behaviour
 * required by the constructor.
 */
vi.mock('./core', async () => {
  // The real core is not needed for the tests – we only need the symbols
  // that `schemas.js` imports.
  const $ZodSuccess = {
    /** Called by the constructor – we just spy on it. */
    init: vi.fn(),
  };

  const ZodType = {
    /** Called by the constructor – we just spy on it. */
    init: vi.fn(),
  };

  /**
   * `$constructor` creates a class‑like constructor.  The real implementation
   * does a lot of work, but for the tests we only need to:
   *   1. store the definition object on `instance._zod.def`
   *   2. invoke the supplied `initFn` so that the mocked `init` functions are
   *      called.
   */
  const $constructor = vi.fn((name: string, initFn: (inst: any, def: any) => void) => {
    return class {
      /** Mimic the internal shape used by the real Zod types. */
      _zod: { def: any } = { def: {} };
      _def: any;

      constructor(def: any) {
        this._def = def;
        // expose the definition to the init function (the real Zod does this)
        this._zod.def = def;
        initFn(this, def);
      }
    };
  });

  return {
    __esModule: true,
    core: {
      $ZodSuccess,
      ZodType,
      $constructor,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*  Import the unit‑under‑test.  The file `schemas.js` re‑exports the
    `ZodSuccess` constructor that we just mocked the dependencies for.          */
/* -------------------------------------------------------------------------- */
import { ZodSuccess } from './schemas.js';

describe('ZodSuccess – unit tests', () => {
  /** Hold a reference to the mocked `core` so we can inspect call counts. */
  let coreMock: typeof import('./core').core;

  beforeEach(async () => {
    // Reset all spies before each test to avoid cross‑test pollution.
    vi.resetAllMocks();
    // Re‑import the mocked core after the reset.
    coreMock = (await import('./core')).core;
  });

  /* ---------------------------------------------------------------------- */
  /*  1️⃣  Typical usage – `unwrap` returns the inner type supplied in the
        definition object.                                                    */
  /* ---------------------------------------------------------------------- */
  it('provides an `unwrap` method that returns the inner type', () => {
    const inner = { foo: 'bar' };
    const def = { innerType: inner };
    const instance = new ZodSuccess(def);

    // `unwrap` must be a function.
    expect(typeof (instance as any).unwrap).toBe('function');

    // Calling it returns exactly the value we passed as `innerType`.
    expect((instance as any).unwrap()).toBe(inner);
  });

  /* ---------------------------------------------------------------------- */
  /*  2️⃣  Verify that the constructor forwards the instance & definition to
        the core initialisers.                                                */
  /* ---------------------------------------------------------------------- */
  it('calls core initialisers with the instance and definition', () => {
    const def = { innerType: 123 };
    const instance = new ZodSuccess(def);

    // Both mocked init functions should have been invoked once.
    expect(coreMock.$ZodSuccess.init).toHaveBeenCalledTimes(1);
    expect(coreMock.ZodType.init).toHaveBeenCalledTimes(1);

    // They must have received the freshly created instance and the same
    // definition object we passed to the constructor.
    expect(coreMock.$ZodSuccess.init).toHaveBeenCalledWith(instance, def);
    expect(coreMock.ZodType.init).toHaveBeenCalledWith(instance, def);
  });

  /* ---------------------------------------------------------------------- */
  /*  3️⃣  Edge case – `innerType` can be `undefined`.  The method should simply
        return that value without throwing.                                   */
  /* ---------------------------------------------------------------------- */
  it('returns `undefined` when the inner type is undefined', () => {
    const def = { innerType: undefined };
    const instance = new ZodSuccess(def);
    expect((instance as any).unwrap()).toBeUndefined();
  });

  /* ---------------------------------------------------------------------- */
  /*  4️⃣  The created object should be an instance of the exported constructor,
        i.e. `instanceof ZodSuccess` must be true.                           */
  /* ---------------------------------------------------------------------- */
  it('is an instance of ZodSuccess', () => {
    const def = { innerType: 'test' };
    const instance = new ZodSuccess(def);
    expect(instance).toBeInstanceOf(ZodSuccess);
  });

  /* ---------------------------------------------------------------------- */
  /*  5️⃣  Additional definition properties are preserved on the internal
        `_zod.def` object – useful for downstream Zod utilities.               */
  /* ---------------------------------------------------------------------- */
  it('preserves extra definition fields on the internal structure', () => {
    const def = {
      innerType: 'value',
      description: 'a custom description',
      customFlag: true,
    };
    const instance = new ZodSuccess(def);

    // The mock constructor stores the whole definition on `_zod.def`.
    expect((instance as any)._zod.def.description).toBe('a custom description');
    expect((instance as any)._zod.def.customFlag).toBe(true);
  });

  /* ---------------------------------------------------------------------- */
  /*  6️⃣  Defensive test – passing a non‑object definition should still create
        an instance (the real Zod library is tolerant) and `unwrap` will
        simply return `undefined`.                                            */
  /* ---------------------------------------------------------------------- */
  it('handles non‑object definitions gracefully', () => {
    // @ts-expect-error – intentionally passing a wrong type.
    const instance = new ZodSuccess(null);
    // The mock constructor still runs, `innerType` is undefined.
    expect((instance as any).unwrap()).toBeUndefined();
  });
});
###Test END##
```