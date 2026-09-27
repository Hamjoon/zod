/**
 * Vitest test suite for the `$ZodPipe` class.
 *
 * The real implementation of `$ZodPipe` depends on several internal modules
 * (`core`, `util`, `$ZodType`, `handlePipeResult`).  In order to test the
 * behaviour of the public API (the `parse` method and the lazy‑exposed
 * properties) we mock those internal modules so that we can control the
 * execution flow and inspect the interactions.
 *
 * The tests cover:
 *   1. Extraction of the public method signatures.
 *   2. Basic functionality for synchronous and asynchronous pipelines.
 *   3. Verification that lazy properties (`values`, `optin`, `optout`,
 *      `propValues`) correctly proxy the inner schema definitions.
 *   4. Edge‑case handling:
 *        • Errors thrown by the inner `run` method (sync & async).
 *        • Errors thrown by `handlePipeResult`.
 *
 * The mock implementations are deliberately simple – they only provide the
 * pieces needed for the `$ZodPipe` constructor to run without touching the
 * rest of the library.
 */

import { describe, it, expect, vi } from "vitest";

/* -------------------------------------------------------------------------
 * 1️⃣  Mock the internal modules that `$ZodPipe` depends on.
 * ------------------------------------------------------------------------- */
vi.mock("./core", () => {
  // `core.$constructor` creates a class that runs the supplied initializer.
  const $constructor = (name: string, initFn: (inst: any, def: any) => void) => {
    return class {
      // expose the name for debugging (optional)
      static readonly __name = name;
      // the constructor receives the definition object.
      constructor(public readonly _def: any) {
        // the instance must have a `_zod` placeholder that the initializer
        // will populate.
        (this as any)._zod = {};
        // run the initializer that adds `parse` and lazy properties.
        initFn(this, _def);
      }
    };
  };
  return { core: { $constructor } };
});

vi.mock("./util", () => {
  // `defineLazy` simply defines a getter that evaluates the supplied fn once.
  const defineLazy = (obj: any, key: string, getter: () => any) => {
    Object.defineProperty(obj, key, {
      get: getter,
      configurable: true,
      enumerable: true,
    });
  };
  return { util: { defineLazy } };
});

vi.mock("./ZodType", () => {
  // `$ZodType.init` is a no‑op for our tests – the real init populates internal
  // state that we do not need.
  const init = vi.fn();
  return { $ZodType: { init } };
});

vi.mock("./handlePipeResult", () => {
  // By default `handlePipeResult` just returns an object that lets us see the
  // values it received.  Individual tests can override this mock.
  const handlePipeResult = vi.fn((left: any, def: any, ctx: any) => ({
    handled: true,
    left,
    def,
    ctx,
  }));
  return { handlePipeResult };
});

/* -------------------------------------------------------------------------
 * 2️⃣  Import the `$ZodPipe` class after the mocks are in place.
 * ------------------------------------------------------------------------- */
import { $ZodPipe } from "./schemas.js";
import { handlePipeResult } from "./handlePipeResult";

/* -------------------------------------------------------------------------
 * 3️⃣  Helper factories to build dummy schema definitions.
 * ------------------------------------------------------------------------- */
type DummyZod = {
  run: (payload: any, ctx?: any) => any;
  values?: any;
  optin?: any;
  optout?: any;
  propValues?: any;
};

function createDummySchema(
  runImpl: (payload: any, ctx?: any) => any,
  extras?: Partial<DummyZod>
): any {
  return {
    _zod: {
      run: runImpl,
      values: extras?.values ?? Symbol("values"),
      optin: extras?.optin ?? Symbol("optin"),
      optout: extras?.optout ?? Symbol("optout"),
      propValues: extras?.propValues ?? Symbol("propValues"),
    },
  };
}

/* -------------------------------------------------------------------------
 * 4️⃣  List of public methods (extracted from the source)
 * ------------------------------------------------------------------------- */
// $ZodPipe exposes a single public method via its internal `_zod` object:
//   parse(payload: unknown, ctx?: unknown): unknown | Promise<unknown>
//
// The lazy‑exposed properties (`values`, `optin`, `optout`, `propValues`) are
// also part of the public API (they are accessible as `pipe._zod.values` etc.).

/* -------------------------------------------------------------------------
 * 5️⃣  Test suite
 * ------------------------------------------------------------------------- */
describe("$ZodPipe", () => {
  /** Reset the mock implementation of `handlePipeResult` before each test. */
  beforeEach(() => {
    vi.clearAllMocks();
    (handlePipeResult as any).mockImplementation((left, def, ctx) => ({
      handled: true,
      left,
      def,
      ctx,
    }));
  });

  /* -----------------------------------------------------------------------
   * 5.1 Basic synchronous parsing
   * --------------------------------------------------------------------- */
  it("should parse synchronously and forward the result through handlePipeResult", () => {
    const leftValue = { foo: "bar" };
    const inSchema = createDummySchema((_payload) => leftValue);
    const outSchema = createDummySchema(() => {
      /* not used in this test */
    });

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    const result = pipe._zod.parse({ any: "payload" }, { some: "ctx" });

    // `parse` should return the value produced by `handlePipeResult`
    expect(result).toEqual({
      handled: true,
      left: leftValue,
      def: { in: inSchema, out: outSchema },
      ctx: { some: "ctx" },
    });

    // Ensure the mock was called with the correct arguments
    expect(handlePipeResult).toHaveBeenCalledOnce();
    expect(handlePipeResult).toHaveBeenCalledWith(
      leftValue,
      { in: inSchema, out: outSchema },
      { some: "ctx" }
    );
  });

  /* -----------------------------------------------------------------------
   * 5.2 Asynchronous parsing (run returns a Promise)
   * --------------------------------------------------------------------- */
  it("should parse asynchronously when the inner run returns a Promise", async () => {
    const leftValue = "async-left";
    const inSchema = createDummySchema(() => Promise.resolve(leftValue));
    const outSchema = createDummySchema(() => {});

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    const resultPromise = pipe._zod.parse("payload");
    // The result must be a Promise
    expect(resultPromise).toBeInstanceOf(Promise);

    const result = await resultPromise;
    expect(result).toEqual({
      handled: true,
      left: leftValue,
      def: { in: inSchema, out: outSchema },
      ctx: undefined,
    });
    expect(handlePipeResult).toHaveBeenCalledOnce();
    expect(handlePipeResult).toHaveBeenCalledWith(
      leftValue,
      { in: inSchema, out: outSchema },
      undefined
    );
  });

  /* -----------------------------------------------------------------------
   * 5.3 Lazy‑exposed properties proxy the inner schema correctly
   * --------------------------------------------------------------------- */
  it("should expose lazy properties that proxy the inner schema definitions", () => {
    const valuesSym = Symbol("custom-values");
    const optinSym = Symbol("custom-optin");
    const optoutSym = Symbol("custom-optout");
    const propValuesSym = Symbol("custom-propValues");

    const inSchema = createDummySchema(() => "x", {
      values: valuesSym,
      optin: optinSym,
      propValues: propValuesSym,
    });
    const outSchema = createDummySchema(() => "y", {
      optout: optoutSym,
    });

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    // Access the lazy properties – they should resolve to the symbols defined
    // above.
    expect(pipe._zod.values).toBe(valuesSym);
    expect(pipe._zod.optin).toBe(optinSym);
    expect(pipe._zod.optout).toBe(optoutSym);
    expect(pipe._zod.propValues).toBe(propValuesSym);
  });

  /* -----------------------------------------------------------------------
   * 5.4 Edge case – inner `run` throws synchronously
   * --------------------------------------------------------------------- */
  it("should propagate synchronous errors thrown by the inner run method", () => {
    const error = new Error("run failed");
    const inSchema = createDummySchema(() => {
      throw error;
    });
    const outSchema = createDummySchema(() => {});

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    expect(() => pipe._zod.parse("payload")).toThrowError(error);
    // `handlePipeResult` must never be called when `run` throws.
    expect(handlePipeResult).not.toHaveBeenCalled();
  });

  /* -----------------------------------------------------------------------
   * 5.5 Edge case – inner `run` returns a rejected Promise
   * --------------------------------------------------------------------- */
  it("should propagate asynchronous rejection from the inner run method", async () => {
    const error = new Error("async run failed");
    const inSchema = createDummySchema(() => Promise.reject(error));
    const outSchema = createDummySchema(() => {});

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    await expect(pipe._zod.parse("payload")).rejects.toThrowError(error);
    expect(handlePipeResult).not.toHaveBeenCalled();
  });

  /* -----------------------------------------------------------------------
   * 5.6 Edge case – `handlePipeResult` throws
   * --------------------------------------------------------------------- */
  it("should propagate errors thrown by handlePipeResult", () => {
    const leftValue = 42;
    const inSchema = createDummySchema(() => leftValue);
    const outSchema = createDummySchema(() => {});

    // Make `handlePipeResult` throw.
    (handlePipeResult as any).mockImplementation(() => {
      throw new Error("handlePipeResult failed");
    });

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    expect(() => pipe._zod.parse("payload")).toThrowError(
      "handlePipeResult failed"
    );
  });

  /* -----------------------------------------------------------------------
   * 5.7 Edge case – `handlePipeResult` returns a Promise (unlikely but possible)
   * --------------------------------------------------------------------- */
  it("should correctly return a Promise when handlePipeResult itself returns a Promise", async () => {
    const leftValue = "value";
    const inSchema = createDummySchema(() => leftValue);
    const outSchema = createDummySchema(() => {});

    // Make `handlePipeResult` async.
    (handlePipeResult as any).mockImplementation(
      async (left: any, def: any, ctx: any) => ({
        asyncHandled: true,
        left,
        def,
        ctx,
      })
    );

    const pipe = new $ZodPipe({ in: inSchema, out: outSchema });

    const result = pipe._zod.parse("payload");
    // Even though `run` is sync, the returned value should be a Promise because
    // the handler is async.
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual({
      asyncHandled: true,
      left: leftValue,
      def: { in: inSchema, out: outSchema },
      ctx: undefined,
    });
  });
});
