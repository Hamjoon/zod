/**
 * Vitest test suite for the `$ZodType` constructor.
 *
 * The tests cover:
 *  1. Construction with **no checks** (deferred initializer logic).
 *  2. Construction with **checks** – synchronous, asynchronous, conditional (`when`),
 *     abort‑on‑error behaviour and the async‑error guard.
 *  3. The `~standard.validate` helper – success path, failure path and the
 *     fallback to the async version when `safeParse` throws.
 *
 * The real implementation depends on many internal modules (`core`, `util`,
 * `checks`, `safeParse`, …).  For the purpose of unit‑testing we replace those
 * modules with lightweight mocks that expose just enough behaviour for the
 * constructor to run.
 *
 * The test file is completely self‑contained – it can be placed next to the
 * source file and executed with `vitest run`.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* -------------------------------------------------------------------------
 * 1️⃣  Mock the internal modules that `$ZodType` imports.
 * ------------------------------------------------------------------------- */
vi.mock("./schemas.js", async () => {
  // The real `$ZodType` is exported from "./schemas.js".  We need to import it
  // after the mocks are in place, so we re‑export the real implementation
  // from the original file (which will now see the mocked dependencies).
  const actual = await vi.importActual("./schemas.js");
  return { ...actual };
});

vi.mock("./core", () => {
  class ZodAsyncError extends Error {
    constructor() {
      super("Async validation attempted in sync context");
      this.name = "ZodAsyncError";
    }
  }

  // `$constructor` returns a function that receives `(inst, def)` and runs the
  // body that we are testing.  The returned function also carries the name
  // for debugging purposes.
  const $constructor = (name: string, fn: any) => {
    const ctor = (inst: any, def: any) => fn(inst, def);
    Object.defineProperty(ctor, "name", { value: name });
    return ctor;
  };

  return { core: { $constructor }, $ZodAsyncError: ZodAsyncError };
});

vi.mock("./util", () => {
  // Minimal utilities used by the constructor.
  const aborted = (payload: any, startLen?: number) => {
    // `payload.issues` is an array; abort when an issue was added.
    if (startLen === undefined) return payload.issues.length > 0;
    return payload.issues.length > startLen;
  };
  return { util: { aborted } };
});

vi.mock("./checks", () => {
  // A dummy `checks` namespace – only the shape of a check is required.
  return {
    checks: {
      // The type is not needed at runtime; we just need a placeholder.
    },
  };
});

vi.mock("./safeParse", () => {
  // `safeParse` and `safeParseAsync` are used by the `validate` method.
  // They will be spied on in the tests.
  const safeParse = vi.fn();
  const safeParseAsync = vi.fn();
  return { safeParse, safeParseAsync };
});

/* -------------------------------------------------------------------------
 * 2️⃣  Import the `$ZodType` after the mocks are installed.
 * ------------------------------------------------------------------------- */
import { $ZodType } from "./schemas.js";
import { core } from "./core";
import { util } from "./util";
import { safeParse, safeParseAsync } from "./safeParse";

/* -------------------------------------------------------------------------
 * 3️⃣  Helper factories used by many tests.
 * ------------------------------------------------------------------------- */
type Payload = { issues: any[]; data?: any };

function makeInst(): any {
  // The constructor expects an object that already contains a `_zod` field.
  // We provide the minimal shape it mutates.
  return {
    _zod: {
      // `def` will be overwritten by the constructor.
      def: undefined,
      // `bag` is optional – the constructor creates it if missing.
      // `traits` is a Set used to detect `$ZodCheck` instances.
      traits: new Set<string>(),
      // `parse` is the core parsing function that the checks wrap.
      parse: vi.fn((payload: Payload) => payload),
    },
  };
}

/* -------------------------------------------------------------------------
 * 4️⃣  The test suite.
 * ------------------------------------------------------------------------- */
describe("$ZodType constructor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /** ---------------------------------------------------------------
   * 1️⃣  No checks – deferred initializer
   * --------------------------------------------------------------- */
  it("creates a deferred initializer when no checks are supplied", () => {
    const inst = makeInst();
    const def = { type: "string" as const };

    // Call the constructor (the exported `$ZodType` is the function returned by
    // `core.$constructor`).
    ($ZodType as any)(inst, def);

    // The constructor should have created a `deferred` array with a single
    // function that later assigns `run` to `parse`.
    expect(Array.isArray(inst._zod.deferred)).toBe(true);
    expect(inst._zod.deferred).toHaveLength(1);
    expect(inst._zod.run).toBeUndefined();

    // Simulate the deferred step.
    const deferredFn = inst._zod.deferred[0];
    deferredFn();

    // After the deferred function runs, `run` must point to the original `parse`.
    expect(inst._zod.run).toBe(inst._zod.parse);
  });

  /** ---------------------------------------------------------------
   * 2️⃣  Checks – synchronous execution, abort on first error
   * --------------------------------------------------------------- */
  it("runs synchronous checks after parsing and aborts after the first issue", () => {
    const inst = makeInst();

    // Create two dummy checks.
    const checkA = {
      _zod: {
        def: {}, // no `when` condition
        onattach: [],
        check: vi.fn((payload: Payload) => {
          // Add an issue – this should abort further checks.
          payload.issues.push({ path: [], message: "A failed" });
          return payload;
        }),
      },
    };
    const checkB = {
      _zod: {
        def: {},
        onattach: [],
        check: vi.fn((payload: Payload) => {
          payload.issues.push({ path: [], message: "B failed" });
          return payload;
        }),
      },
    };

    // Attach the checks to the definition.
    const def = {
      type: "string" as const,
      checks: [checkA, checkB],
    };

    ($ZodType as any)(inst, def);

    // `run` should now be a wrapper that first calls `parse` then the checks.
    expect(typeof inst._zod.run).toBe("function");

    const payload: Payload = { issues: [] };
    const result = inst._zod.run(payload, { async: true });

    // Because all checks are synchronous, `run` returns the payload directly.
    expect(result).toBe(payload);
    // `parse` should have been called once.
    expect(inst._zod.parse).toHaveBeenCalledTimes(1);
    // Only the first check should have been executed.
    expect(checkA._zod.check).toHaveBeenCalledTimes(1);
    expect(checkB._zod.check).not.toHaveBeenCalled();
    // The payload now contains exactly one issue.
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].message).toBe("A failed");
  });

  /** ---------------------------------------------------------------
   * 3️⃣  Checks – asynchronous check handling
   * --------------------------------------------------------------- */
  it("awaits asynchronous checks and propagates issues", async () => {
    const inst = makeInst();

    const asyncCheck = {
      _zod: {
        def: {},
        onattach: [],
        // Return a Promise that resolves after a short timeout.
        check: vi.fn((payload: Payload) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              payload.issues.push({ path: [], message: "async issue" });
              resolve();
            }, 10);
          });
        }),
      },
    };

    const def = {
      type: "string" as const,
      checks: [asyncCheck],
    };

    ($ZodType as any)(inst, def);

    const payload: Payload = { issues: [] };
    const result = inst._zod.run(payload, { async: true });

    // The result must be a Promise because at least one check is async.
    expect(result).toBeInstanceOf(Promise);
    const finalPayload = await result;

    // Verify that the async check was awaited.
    expect(asyncCheck._zod.check).toHaveBeenCalledTimes(1);
    expect(finalPayload.issues).toHaveLength(1);
    expect(finalPayload.issues[0].message).toBe("async issue");
  });

  /** ---------------------------------------------------------------
   * 4️⃣  Checks – conditional execution via `when`
   * --------------------------------------------------------------- */
  it("skips a check when its `when` predicate returns false", () => {
    const inst = makeInst();

    const conditionalCheck = {
      _zod: {
        def: {
          when: (payload: Payload) => false, // never run
        },
        onattach: [],
        check: vi.fn(),
      },
    };

    const alwaysRunCheck = {
      _zod: {
        def: {},
        onattach: [],
        check: vi.fn((payload: Payload) => {
          payload.issues.push({ path: [], message: "always runs" });
          return payload;
        }),
      },
    };

    const def = {
      type: "string" as const,
      checks: [conditionalCheck, alwaysRunCheck],
    };

    ($ZodType as any)(inst, def);

    const payload: Payload = { issues: [] };
    const result = inst._zod.run(payload, { async: true });

    expect(result).toBe(payload);
    // Conditional check should never be called.
    expect(conditionalCheck._zod.check).not.toHaveBeenCalled();
    // The always‑run check should have been called once.
    expect(alwaysRunCheck._zod.check).toHaveBeenCalledTimes(1);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].message).toBe("always runs");
  });

  /** ---------------------------------------------------------------
   * 5️⃣  Async‑error guard – throws when async check is used in sync mode
   * --------------------------------------------------------------- */
  it("throws $ZodAsyncError if an async check runs while ctx.async === false", async () => {
    const inst = makeInst();

    const asyncCheck = {
      _zod: {
        def: {},
        onattach: [],
        check: vi.fn(() => Promise.resolve()),
      },
    };

    const def = {
      type: "string" as const,
      checks: [asyncCheck],
    };

    ($ZodType as any)(inst, def);

    const payload: Payload = { issues: [] };
    const syncCtx = { async: false };

    // The wrapper should detect the async result and throw.
    expect(() => inst._zod.run(payload, syncCtx)).toThrow(core.$ZodAsyncError);
  });

  /** ---------------------------------------------------------------
   * 6️⃣  `~standard.validate` – success path (sync safeParse)
   * --------------------------------------------------------------- */
  it("returns `{ value }` when safeParse succeeds", () => {
    const inst = makeInst();

    // No checks – we only need the `validate` helper.
    const def = { type: "string" as const };
    ($ZodType as any)(inst, def);

    // Mock `safeParse` to return a successful result.
    safeParse.mockImplementation(() => ({
      success: true,
      data: "parsed value",
    }));

    const result = inst["~standard"].validate("any input");

    expect(safeParse).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ value: "parsed value" });
  });

  /** ---------------------------------------------------------------
   * 7️⃣  `~standard.validate` – failure path (sync safeParse)
   * --------------------------------------------------------------- */
  it("returns `{ issues }` when safeParse fails", () => {
    const inst = makeInst();

    const def = { type: "string" as const };
    ($ZodType as any)(inst, def);

    safeParse.mockImplementation(() => ({
      success: false,
      error: { issues: [{ message: "invalid" }] },
    }));

    const result = inst["~standard"].validate("bad input");

    expect(safeParse).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ issues: [{ message: "invalid" }] });
  });

  /** ---------------------------------------------------------------
   * 8️⃣  `~standard.validate` – fallback to async when safeParse throws
   * --------------------------------------------------------------- */
  it("falls back to safeParseAsync when safeParse throws", async () => {
    const inst = makeInst();

    const def = { type: "string" as const };
    ($ZodType as any)(inst, def);

    // safeParse throws synchronously.
    safeParse.mockImplementation(() => {
      throw new Error("boom");
    });

    // safeParseAsync resolves with a successful result.
    safeParseAsync.mockImplementation(() =>
      Promise.resolve({ success: true, data: "async parsed" })
    );

    const resultPromise = inst["~standard"].validate("whatever");

    // The method returns a Promise because of the fallback.
    expect(resultPromise).toBeInstanceOf(Promise);
    const result = await resultPromise;

    expect(safeParse).toHaveBeenCalledTimes(1);
    expect(safeParseAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ value: "async parsed" });
  });
});
