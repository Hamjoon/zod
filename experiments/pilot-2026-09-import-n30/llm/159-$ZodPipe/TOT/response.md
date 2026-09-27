###Test START##
```ts
/**
 * Vitest test suite for the `$ZodPipe` class.
 *
 * The tests cover:
 * 1. Lazy property wiring (`values`, `optin`, `optout`, `propValues`).
 * 2. Synchronous parsing flow.
 * 3. Asynchronous parsing flow (Promise‑based input schema).
 * 4. Error propagation from the input schema.
 * 5. Correct forwarding of the parsing context.
 *
 * The test file assumes that `./schemas.js` exports:
 *   - `$ZodPipe` – the constructor function.
 *   - `handlePipeResult` – the internal helper used by `$ZodPipe` to
 *                         post‑process the result of the input schema.
 *
 * Because the real `$ZodType` implementation is not required for these
 * unit tests, we create lightweight mock schemas that mimic the shape
 * expected by `$ZodPipe`.  The mocks expose a `_zod` object with the
 * properties `run`, `values`, `optin`, `optout`, and `propValues`.
 *
 * The tests use Vitest's `vi` utilities to spy on and stub functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { $ZodPipe, handlePipeResult } from "./schemas.js";

/**
 * Helper to create a minimal mock `$ZodType`‑like object.
 *
 * @param options - Configuration for the mock.
 * @returns A mock schema with a `_zod` namespace.
 */
function createMockSchema({
  runResult,
  values = { mock: "values" },
  optin = { mock: "optin" },
  optout = { mock: "optout" },
  propValues = { mock: "propValues" },
}: {
  /** The value (or Promise) that `_zod.run` should return. */
  runResult: any;
  /** Arbitrary data to expose via the lazy `values` property. */
  values?: any;
  /** Arbitrary data to expose via the lazy `optin` property. */
  optin?: any;
  /** Arbitrary data to expose via the lazy `optout` property. */
  optout?: any;
  /** Arbitrary data to expose via the lazy `propValues` property. */
  propValues?: any;
}) {
  return {
    // The `$ZodPipe` constructor only cares about the `_zod` namespace.
    _zod: {
      // `run` will be spied on; we provide a default implementation that
      // returns the supplied `runResult`.
      run: vi.fn(() => runResult),
      values,
      optin,
      optout,
      propValues,
    },
  };
}

/**
 * Reset all spies/mocks after each test to avoid cross‑test contamination.
 */
afterEach(() => {
  vi.restoreAllMocks();
});

describe("$ZodPipe – lazy property wiring", () => {
  it("exposes `values`, `optin`, `optout` and `propValues` from the inner schemas", () => {
    const mockIn = createMockSchema({ runResult: "ok" });
    const mockOut = createMockSchema({ runResult: "ok", optout: { out: "special" } });

    // Construct the pipe.  The `$ZodPipe` constructor expects an object with
    // `in` and `out` properties that are `$ZodType`‑like.
    const pipe = $ZodPipe({ in: mockIn, out: mockOut });

    // The lazy getters should forward to the underlying schema objects.
    expect(pipe._zod.values).toBe(mockIn._zod.values);
    expect(pipe._zod.optin).toBe(mockIn._zod.optin);
    expect(pipe._zod.optout).toBe(mockOut._zod.optout);
    expect(pipe._zod.propValues).toBe(mockIn._zod.propValues);
  });
});

describe("$ZodPipe – parsing behaviour", () => {
  let mockIn: ReturnType<typeof createMockSchema>;
  let mockOut: ReturnType<typeof createMockSchema>;
  let pipe: any; // the concrete `$ZodPipe` instance

  beforeEach(() => {
    // Fresh mocks for each test.
    mockIn = createMockSchema({ runResult: "raw-sync" });
    mockOut = createMockSchema({ runResult: "raw-out" });
    pipe = $ZodPipe({ in: mockIn, out: mockOut });
  });

  it("parses synchronously and forwards the result to `handlePipeResult`", () => {
    // Spy on the internal helper.
    const handleSpy = vi
      .spyOn({ handlePipeResult }, "handlePipeResult")
      .mockImplementation((left, def, ctx) => ({
        transformed: left,
        def,
        ctx,
      }));

    const payload = { foo: "bar" };
    const ctx = { path: ["root"] };

    const result = pipe._zod.parse(payload, ctx);

    // `run` should have been called with the original payload and context.
    expect(mockIn._zod.run).toHaveBeenCalledOnce();
    expect(mockIn._zod.run).toHaveBeenCalledWith(payload, ctx);

    // `handlePipeResult` should have been invoked with the raw output,
    // the pipe definition, and the same context.
    expect(handleSpy).toHaveBeenCalledOnce();
    expect(handleSpy).toHaveBeenCalledWith("raw-sync", pipe._def, ctx);

    // The final result should be whatever our mock `handlePipeResult`
    // returned.
    expect(result).toEqual({
      transformed: "raw-sync",
      def: pipe._def,
      ctx,
    });
  });

  it("parses asynchronously when the input schema returns a Promise", async () => {
    // Make the input schema return a Promise.
    const asyncResult = Promise.resolve("raw-async");
    mockIn._zod.run.mockImplementation(() => asyncResult);

    const handleSpy = vi
      .spyOn({ handlePipeResult }, "handlePipeResult")
      .mockImplementation((left, def, ctx) => ({
        transformed: left,
        def,
        ctx,
      }));

    const payload = { baz: 42 };
    const ctx = { path: ["root", "async"] };

    const parseResult = pipe._zod.parse(payload, ctx);
    // The parse method should return a Promise because the inner `run`
    // returned a Promise.
    expect(parseResult).toBeInstanceOf(Promise);

    const resolved = await parseResult;

    // Verify that the inner `run` was called correctly.
    expect(mockIn._zod.run).toHaveBeenCalledOnce();
    expect(mockIn._zod.run).toHaveBeenCalledWith(payload, ctx);

    // Verify that `handlePipeResult` was awaited and received the resolved value.
    expect(handleSpy).toHaveBeenCalledOnce();
    expect(handleSpy).toHaveBeenCalledWith("raw-async", pipe._def, ctx);

    // The final resolved value should be the mock transformation.
    expect(resolved).toEqual({
      transformed: "raw-async",
      def: pipe._def,
      ctx,
    });
  });

  it("propagates errors thrown synchronously by the input schema", () => {
    const error = new Error("boom!");
    mockIn._zod.run.mockImplementation(() => {
      throw error;
    });

    const payload = { bad: true };
    const ctx = {};

    // The parse call should re‑throw the original error.
    expect(() => pipe._zod.parse(payload, ctx)).toThrowError(error);
    // Ensure `handlePipeResult` was never invoked.
    const handleSpy = vi.spyOn({ handlePipeResult }, "handlePipeResult");
    expect(handleSpy).not.toHaveBeenCalled();
  });

  it("propagates a rejected Promise from the input schema", async () => {
    const rejection = new Error("async boom!");
    mockIn._zod.run.mockImplementation(() => Promise.reject(rejection));

    const payload = { async: true };
    const ctx = {};

    // The parse method returns a Promise that should reject with the same error.
    await expect(pipe._zod.parse(payload, ctx)).rejects.toThrowError(rejection);
    // `handlePipeResult` must not be called because the pipeline never reaches
    // the post‑processing step.
    const handleSpy = vi.spyOn({ handlePipeResult }, "handlePipeResult");
    expect(handleSpy).not.toHaveBeenCalled();
  });
});
```
###Test END##