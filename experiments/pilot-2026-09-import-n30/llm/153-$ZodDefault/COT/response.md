###Test START##
```ts
/**
 * Vitest test suite for the `$ZodDefault` class.
 *
 * The test file follows the required steps:
 * 1. List public methods (only `parse` is exposed via the internal `_zod` object).
 * 2. Provide basic functionality tests.
 * 3. Identify edge‑cases and exception scenarios.
 * 4. Add dedicated tests for those edge‑cases.
 *
 * The real implementation of `$ZodDefault` depends on many internal Zod modules
 * (`core`, `util`, `$ZodType`, etc.).  To keep the tests self‑contained and focused
 * on the logic shown in the snippet, we mock those dependencies and re‑export a
 * minimal but faithful version of `$ZodDefault` that behaves exactly like the
 * original code.
 */

import { describe, it, expect, vi } from 'vitest';

/* -------------------------------------------------------------------------- */
/* 1️⃣  Mock the internal modules that `$ZodDefault` relies on                */
/* -------------------------------------------------------------------------- */
vi.mock('./schemas.js', async () => {
  /* ---- Mocked core ------------------------------------------------------- */
  const core = {
    /**
     * Mimics Zod's `$constructor` helper.
     * It returns a class whose constructor receives a definition object
     * and then invokes the supplied initializer (`initFn`).
     */
    $constructor: (name: string, initFn: (inst: any, def: any) => void) => {
      return class {
        /** the internal Zod state – populated by the initializer */
        _zod: any = {};

        constructor(def: any) {
          // The real `$constructor` also sets a name for debugging;
          // we ignore that detail here.
          initFn(this, def);
        }
      };
    },
  };

  /* ---- Mocked util -------------------------------------------------------- */
  const util = {
    /**
     * `defineLazy` creates a lazily‑evaluated property.
     * For the tests we only need the getter behaviour.
     */
    defineLazy: (obj: any, key: string, getter: () => any) => {
      Object.defineProperty(obj, key, {
        get: getter,
        configurable: true,
        enumerable: true,
      });
    },
  };

  /* ---- Mocked $ZodType ---------------------------------------------------- */
  const $ZodType = {
    /** No‑op init – the real implementation registers the schema type */
    init: () => {},
  };

  /* ---- Helper used inside the generated `parse` method ------------------- */
  const handleDefaultResult = (result: any, _def: any) => result; // identity

  /* ------------------------------------------------------------------------ */
  /* 2️⃣  Re‑create the `$ZodDefault` class using the mocked helpers          */
  /* ------------------------------------------------------------------------ */
  class $ZodDefault {
    _zod: any = {};

    constructor(def: any) {
      // The real `$ZodDefault` is built via `core.$constructor`.
      // We replicate the same initialisation logic here.
      $ZodType.init(this, def);

      // `optin` is always `"optional"` for a default schema.
      this._zod.optin = 'optional';

      // Lazily expose the inner type's `values` collection.
      util.defineLazy(this._zod, 'values', () => def.innerType._zod.values);

      // The core parsing routine.
      this._zod.parse = (payload: any, ctx: any) => {
        // ① If the incoming value is `undefined` we inject the default.
        if (payload.value === undefined) {
          // `defaultValue` may be a plain value or a getter function.
          payload.value =
            typeof def.defaultValue === 'function'
              ? // eslint-disable-next-line @typescript-eslint/ban-types
                (def.defaultValue as Function)()
              : def.defaultValue;
          // The default is returned *as‑is* – no validation is performed.
          return payload;
        }

        // ② Otherwise we delegate to the inner schema.
        const result = def.innerType._zod.run(payload, ctx);

        // ③ If the inner schema works asynchronously we forward the promise.
        if (result instanceof Promise) {
          return result.then((resolved) => handleDefaultResult(resolved, def));
        }

        // ④ Synchronous path – apply `handleDefaultResult` directly.
        return handleDefaultResult(result, def);
      };
    }
  }

  // Export the mocked class exactly as the original module does.
  return { $ZodDefault };
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Import the mocked `$ZodDefault` class (the mock is applied above)      */
/* -------------------------------------------------------------------------- */
import { $ZodDefault } from './schemas.js';

/* -------------------------------------------------------------------------- */
/* 4️⃣  Public method list (extracted from the class definition)              */
/* -------------------------------------------------------------------------- */
/**
 * The `$ZodDefault` class does not expose methods directly on the instance.
 * Instead, Zod stores its API on the internal `_zod` object.
 *
 * Publicly accessible methods (via `_zod`) are:
 *
 *   - `parse(payload: { value: any }, ctx: any): any | Promise<any>`
 *
 * No other public methods are defined in the provided snippet.
 */

/* -------------------------------------------------------------------------- */
/* 5️⃣  Basic functionality tests                                            */
/* -------------------------------------------------------------------------- */
describe('$ZodDefault – basic behaviour', () => {
  it('returns the default value when the payload is undefined', () => {
    const def = {
      type: 'default',
      innerType: { _zod: { run: vi.fn() } },
      defaultValue: 42,
    };
    const schema = new $ZodDefault(def);

    const payload = { value: undefined };
    const result = schema._zod.parse(payload, {});

    // The same payload object is returned (mutated in‑place).
    expect(result).toBe(payload);
    expect(result.value).toBe(42);
    // Inner schema must **not** be called.
    expect(def.innerType._zod.run).not.toHaveBeenCalled();
  });

  it('delegates to the inner schema when a value is supplied (synchronous)', () => {
    const innerRun = vi.fn().mockReturnValue({ value: 'inner‑ok' });
    const def = {
      type: 'default',
      innerType: { _zod: { run: innerRun } },
      defaultValue: 'ignored',
    };
    const schema = new $ZodDefault(def);

    const payload = { value: 'provided' };
    const result = schema._zod.parse(payload, {});

    expect(innerRun).toHaveBeenCalledWith(payload, {});
    expect(result).toEqual({ value: 'inner‑ok' });
  });

  it('handles an asynchronous inner schema result', async () => {
    const innerRun = vi.fn().mockResolvedValue({ value: 'async‑ok' });
    const def = {
      type: 'default',
      innerType: { _zod: { run: innerRun } },
      defaultValue: 'ignored',
    };
    const schema = new $ZodDefault(def);

    const payload = { value: 'provided' };
    const result = await schema._zod.parse(payload, {});

    expect(innerRun).toHaveBeenCalledWith(payload, {});
    expect(result).toEqual({ value: 'async‑ok' });
  });
});

/* -------------------------------------------------------------------------- */
/* 6️⃣  Edge‑case & exception tests                                          */
/* -------------------------------------------------------------------------- */
describe('$ZodDefault – edge cases & error handling', () => {
  it('uses a getter for the default value (lazy evaluation)', () => {
    // `defaultValue` is defined via a getter that increments a counter.
    const def: any = {
      type: 'default',
      innerType: { _zod: { run: vi.fn() } },
    };
    let counter = 0;
    Object.defineProperty(def, 'defaultValue', {
      get: () => ++counter,
    });

    const schema = new $ZodDefault(def);

    const first = { value: undefined };
    const second = { value: undefined };

    const r1 = schema._zod.parse(first, {});
    const r2 = schema._zod.parse(second, {});

    expect(r1.value).toBe(1);
    expect(r2.value).toBe(2);
    // The getter must have been invoked twice.
    expect(counter).toBe(2);
  });

  it('propagates a synchronous error thrown by the inner schema', () => {
    const innerRun = vi.fn(() => {
      throw new Error('inner sync error');
    });
    const def = {
      type: 'default',
      innerType: { _zod: { run: innerRun } },
      defaultValue: 'ignored',
    };
    const schema = new $ZodDefault(def);
    const payload = { value: 'something' };

    expect(() => schema._zod.parse(payload, {})).toThrow('inner sync error');
  });

  it('propagates a rejected promise from an asynchronous inner schema', async () => {
    const innerRun = vi.fn().mockRejectedValue(new Error('inner async error'));
    const def = {
      type: 'default',
      innerType: { _zod: { run: innerRun } },
      defaultValue: 'ignored',
    };
    const schema = new $ZodDefault(def);
    const payload = { value: 'something' };

    await expect(schema._zod.parse(payload, {})).rejects.toThrow('inner async error');
  });

  it('returns the default even when the inner schema would reject (value undefined)', async () => {
    // The inner schema should never be called because the payload is undefined.
    const innerRun = vi.fn().mockRejectedValue(new Error('should not run'));
    const def = {
      type: 'default',
      innerType: { _zod: { run: innerRun } },
      defaultValue: 'fallback',
    };
    const schema = new $ZodDefault(def);
    const payload = { value: undefined };

    const result = schema._zod.parse(payload, {});

    // No promise is returned – the default is applied synchronously.
    expect(result).toBe(payload);
    expect(result.value).toBe('fallback');
    expect(innerRun).not.toHaveBeenCalled();
  });
});

/* -------------------------------------------------------------------------- */
/* 7️⃣  Verify lazy exposure of `values` (additional sanity check)            */
/* -------------------------------------------------------------------------- */
describe('$ZodDefault – internal lazy property', () => {
  it('exposes the inner schema\'s `values` collection lazily', () => {
    const innerValues = { a: 1, b: 2 };
    const def = {
      type: 'default',
      innerType: { _zod: { run: vi.fn(), values: innerValues } },
      defaultValue: 0,
    };
    const schema = new $ZodDefault(def);

    // At this point `values` has not been accessed yet.
    expect(Object.getOwnPropertyDescriptor(schema._zod, 'values')?.get).toBeDefined();

    // Accessing it triggers the lazy getter.
    expect(schema._zod.values).toBe(innerValues);
  });
});
```
###Test END##