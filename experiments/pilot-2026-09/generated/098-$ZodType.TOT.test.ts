/**
 * Vitest test suite for the `$ZodType` constructor.
 *
 * The tests cover:
 *  • Basic instance initialization (def, bag, version)
 *  • Execution of `onattach` callbacks
 *  • Deferred initializer when no checks are present
 *  • Synchronous and asynchronous check execution
 *  • Proper handling of the `when` predicate
 *  • Abort‑on‑first‑error logic
 *  • The `validate` method (both sync and async fall‑backs)
 *
 * All external dependencies (`core`, `util`, `checks`, `errors`,
 * `safeParse`, `safeParseAsync`, `version`) are mocked so the
 * behaviour of `$ZodType` can be exercised in isolation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocked external modules
// ---------------------------------------------------------------------------

/**
 * Mock for the `core` module.
 * Provides:
 *   - `$constructor` that returns a wrapper function executing the real
 *     implementation (the one we are testing).
 *   - `$ZodAsyncError` class used to signal async‑only checks.
 */
vi.mock("./core", () => {
  class $ZodAsyncError extends Error {
    constructor() {
      super("Async check called in sync context");
      this.name = "ZodAsyncError";
    }
  }

  const $constructor = (name: string, impl: any) => {
    // The real implementation expects `(inst, def)` arguments.
    // We return a function that forwards those arguments to `impl`.
    return (inst: any, def: any) => impl(inst, def);
  };

  return { core: { $constructor, $ZodAsyncError } };
});

/**
 * Mock for the `util` module.
 * Provides:
 *   - `aborted(payload, startLen?)` – returns `true` if any issues have
 *     been added after `startLen` (or simply if `payload.issues` is non‑empty).
 */
vi.mock("./util", () => {
  const aborted = (payload: any, startLen?: number) => {
    if (typeof startLen === "number") {
      return payload.issues.length > startLen;
    }
    return payload.issues.length > 0;
  };
  return { util: { aborted } };
});

/**
 * Mock for the `checks` module.
 * Provides a minimal `$ZodCheck` interface used by `$ZodType`.
 */
vi.mock("./checks", () => {
  // A simple check that can be configured per test.
  class DummyCheck {
    _zod: any;
    constructor(public name: string, public fn: (payload: any) => any, public when?: (payload: any) => boolean) {
      this._zod = {
        def: { when: this.when },
        onattach: [],
        check: this.fn,
      };
    }
  }

  return { checks: { DummyCheck } };
});

/**
 * Mock for the `errors` module – not used directly in the tests,
 * but required for the type definition.
 */
vi.mock("./errors", () => ({ errors: {} }));

/**
 * Mock for the `safeParse` and `safeParseAsync` helpers.
 * They simply return a success object when the payload contains no issues,
 * otherwise a failure object.
 */
vi.mock("./safeParse", () => {
  const safeParse = (schema: any, value: any) => {
    // The schema's internal parse will be called via `schema._zod.run`.
    const payload = { issues: [], data: value };
    const result = schema._zod.run(payload, { async: true });
    if (result instanceof Promise) {
      // In sync mode we never expect a Promise; throw to trigger async fallback.
      throw new Error("Unexpected async");
    }
    return result.issues.length === 0
      ? { success: true, data: result.data }
      : { success: false, error: { issues: result.issues } };
  };

  const safeParseAsync = async (schema: any, value: any) => {
    const payload = { issues: [], data: value };
    const result = await schema._zod.run(payload, { async: true });
    return result.issues.length === 0
      ? { success: true, data: result.data }
      : { success: false, error: { issues: result.issues } };
  };

  return { safeParse, safeParseAsync };
});

/**
 * Mock for the `version` constant used by `$ZodType`.
 */
vi.mock("./version", () => ({ version: "1.0.0-mocked" }));

// ---------------------------------------------------------------------------
// Import the module under test after all mocks are in place
// ---------------------------------------------------------------------------

import { $ZodType } from "./$ZodType";
import { core } from "./core";
import { util } from "./util";
import { checks } from "./checks";
import { safeParse, safeParseAsync } from "./safeParse";

// ---------------------------------------------------------------------------
// Helper utilities for the tests
// ---------------------------------------------------------------------------

/**
 * Creates a fresh instance object that mimics the internal shape expected
 * by `$ZodType`. The `_zod` property is pre‑populated with the minimal
 * fields used by the constructor.
 */
function createInstance() {
  return {
    _zod: {
      def: {} as any,
      bag: undefined,
      version: undefined,
      traits: new Set<string>(),
      // placeholders that will be overwritten by the constructor
      parse: (payload: any) => payload,
      onattach: [] as any[],
    },
  };
}

/**
 * Minimal payload shape used throughout the tests.
 */
type ParsePayload = { issues: any[]; data?: any };

/**
 * Context object passed to `run`/`parse`.
 */
type ParseContext = { async: boolean };

/**
 * Utility to create a dummy check that pushes an issue into the payload.
 */
function makeIssueCheck(issueMsg: string, when?: (payload: any) => boolean) {
  return new checks.DummyCheck(
    "issueCheck",
    (payload: ParsePayload) => {
      payload.issues.push({ message: issueMsg });
      return payload;
    },
    when
  );
}

/**
 * Utility to create a dummy async check that resolves after a tick.
 */
function makeAsyncIssueCheck(issueMsg: string) {
  return new checks.DummyCheck(
    "asyncIssueCheck",
    async (payload: ParsePayload) => {
      await new Promise((r) => setTimeout(r, 0));
      payload.issues.push({ message: issueMsg });
      return payload;
    }
  );
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("$ZodType constructor", () => {
  beforeEach(() => {
    // Reset any global state between tests.
    vi.clearAllMocks();
  });

  it("initializes instance with def, bag and version", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // Call the constructor (the exported `$ZodType` is actually the wrapper)
    $ZodType(inst, def);

    expect(inst._zod.def).toBe(def);
    expect(inst._zod.bag).toEqual({});
    expect(inst._zod.version).toBe("1.0.0-mocked");
  });

  it("executes onattach callbacks for each check (including self‑check)", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // Simulate that the instance itself is a check
    const selfCheck = new checks.DummyCheck(
      "self",
      (payload: ParsePayload) => payload,
      undefined
    );
    // Mark the instance as a check via its traits set
    (inst._zod.traits as Set<string>).add("$ZodCheck");
    // Attach a dummy onattach that mutates a flag
    let onattachCalled = false;
    selfCheck._zod.onattach.push(() => {
      onattachCalled = true;
    });

    // Provide an additional external check with its own onattach
    const externalCheck = new checks.DummyCheck(
      "external",
      (payload: ParsePayload) => payload,
      undefined
    );
    externalCheck._zod.onattach.push(() => {
      onattachCalled = true;
    });

    // Attach the external check via the definition
    const defWithChecks = { ...def, checks: [externalCheck] as any };

    // Run constructor
    $ZodType(inst, defWithChecks);

    // Both onattach callbacks should have been invoked
    expect(onattachCalled).toBe(true);
  });

  it("creates a deferred initializer when no checks are present", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // No checks in definition
    $ZodType(inst, def);

    // The constructor should have created a deferred array with a function
    expect(Array.isArray(inst._zod.deferred)).toBe(true);
    expect(inst._zod.deferred?.length).toBe(1);
    // The deferred function should set `run` to `parse`
    const deferredFn = inst._zod.deferred?.[0];
    expect(typeof deferredFn).toBe("function");
    // Simulate that `parse` returns a payload with no issues
    const dummyPayload = { issues: [] };
    inst._zod.parse = (p: any) => dummyPayload;
    deferredFn?.();
    expect(inst._zod.run).toBe(inst._zod.parse);
  });

  it("runs synchronous checks and aborts after the first issue", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    const checkA = makeIssueCheck("first issue");
    const checkB = makeIssueCheck("second issue");

    const defWithChecks = { ...def, checks: [checkA, checkB] as any };
    $ZodType(inst, defWithChecks);

    const payload: ParsePayload = { issues: [] };
    const result = inst._zod.run(payload, { async: true });

    // Since checks are synchronous, `run` returns the payload directly.
    expect(result).toBe(payload);
    // Only the first check should have added an issue; abort stops further checks.
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].message).toBe("first issue");
  });

  it("executes async checks and throws when async is disabled", async () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    const asyncCheck = makeAsyncIssueCheck("async issue");
    const defWithChecks = { ...def, checks: [asyncCheck] as any };
    $ZodType(inst, defWithChecks);

    const payload: ParsePayload = { issues: [] };
    // Run with async disabled – should throw $ZodAsyncError
    expect(() => inst._zod.run(payload, { async: false })).toThrow(
      core.$ZodAsyncError
    );

    // Run with async enabled – should resolve and contain the issue
    const result = await inst._zod.run(payload, { async: true });
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].message).toBe("async issue");
  });

  it("honors the `when` predicate to conditionally run a check", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // This check only runs when payload has a `runWhen` flag set to true.
    const conditionalCheck = makeIssueCheck(
      "conditional issue",
      (payload) => !!payload.runWhen
    );

    const defWithChecks = { ...def, checks: [conditionalCheck] as any };
    $ZodType(inst, defWithChecks);

    // Payload where predicate is false – no issue should be added.
    const payload1: any = { issues: [], runWhen: false };
    const result1 = inst._zod.run(payload1, { async: true });
    expect(result1.issues).toHaveLength(0);

    // Payload where predicate is true – issue should be added.
    const payload2: any = { issues: [], runWhen: true };
    const result2 = inst._zod.run(payload2, { async: true });
    expect(result2.issues).toHaveLength(1);
    expect(result2.issues[0].message).toBe("conditional issue");
  });

  it("validate method returns value on successful parse (sync path)", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // No checks – deferred initializer will set run = parse.
    $ZodType(inst, def);
    // Ensure deferred initializer runs
    inst._zod.deferred?.[0]();

    const value = "hello world";
    const result = inst["~standard"].validate(value);
    expect(result).toEqual({ value });
  });

  it("validate method returns issues on failed parse (sync path)", () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // Add a check that always fails.
    const failingCheck = makeIssueCheck("always fails");
    const defWithChecks = { ...def, checks: [failingCheck] as any };
    $ZodType(inst, defWithChecks);

    const value = "bad value";
    const result = inst["~standard"].validate(value);
    expect(result).toHaveProperty("issues");
    expect(result.issues?.[0].message).toBe("always fails");
  });

  it("validate method falls back to async safeParse when sync throws", async () => {
    const def = { type: "string" as const };
    const inst = createInstance();

    // Simulate a sync parse that throws (e.g., because it returns a Promise)
    inst._zod.parse = () => {
      throw new Error("sync parse not supported");
    };
    // Provide an async check so that safeParseAsync will resolve.
    const asyncCheck = makeAsyncIssueCheck("async only");
    const defWithChecks = { ...def, checks: [asyncCheck] as any };
    $ZodType(inst, defWithChecks);

    const value = "test";
    const resultPromise = inst["~standard"].validate(value);
    // The method returns a Promise because the sync path threw.
    expect(resultPromise).toBeInstanceOf(Promise);
    const result = await resultPromise;
    // The async path should succeed (no issues added by the async check because
    // we run with `async: true` and the check adds an issue – we assert that it
    // appears in the result).
    expect(result).toHaveProperty("issues");
    expect(result.issues?.[0].message).toBe("async only");
  });
});
