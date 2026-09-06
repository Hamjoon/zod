/**
 * Vitest test suite for the `$ZodType` class.
 *
 * The suite covers:
 *   • Public API (`~standard.validate`)
 *   • Edge‑cases around internal check handling (deferred run, async‑error, conditional checks, aborting)
 *
 * NOTE: The internal Zod helpers (`core`, `util`, `checks`, …) are not part of the public API,
 *       but they are reachable through the public `_zod` property.  In the tests we
 *       cast to `any` to interact with them – this is a common pattern when unit‑testing
 *       library internals.
 */

import { describe, it, expect } from "vitest";
import { $ZodType } from "./$ZodType"; // <-- adjust the import path to where the class lives

/* -------------------------------------------------------------------------- */
/* Helper factories to build minimal “check” objects that the constructor expects */
/* -------------------------------------------------------------------------- */

/**
 * Minimal shape of a `$ZodCheck` that can be attached to a `$ZodType` instance.
 *
 * Only the fields used by the constructor are provided:
 *   - `_zod.def.when?`   – optional predicate that decides whether the check runs
 *   - `_zod.onattach`   – array of functions executed when the check is attached
 *   - `_zod.check`      – the actual validation function (may be sync or async)
 */
function createMockCheck(
  opts: {
    /** Called with the payload; may push issues onto `payload.issues`. */
    check: (payload: any) => void | Promise<void>;
    /** Optional predicate that decides if the check should run. */
    when?: (payload: any) => boolean;
    /** Optional side‑effect executed when the check is attached to the schema. */
    onattach?: ((inst: any) => void)[];
  }
) {
  return {
    _zod: {
      def: {
        when: opts.when,
      },
      onattach: opts.onattach ?? [],
      check: opts.check,
    },
  } as any; // cast to the expected `$ZodCheck` shape
}

/**
 * Very small “payload” object that mimics Zod’s internal `ParsePayload`.
 * Only the `issues` array is required for the tests.
 */
function makePayload(value: unknown) {
  return {
    value,
    issues: [] as any[],
  };
}

/* -------------------------------------------------------------------------- */
/* Test suite */
/* -------------------------------------------------------------------------- */

describe("$ZodType – public façade and internal check handling", () => {
  /* -------------------------------------------------------------- */
  /* 1️⃣  Bare schema (no checks) – the “deferred” path */
  /* -------------------------------------------------------------- */
  it("should validate a plain schema without any checks (deferred run)", async () => {
    // Create a schema that only knows its type – no checks are supplied.
    const schema = new ($ZodType as any)({ type: "string" }) as any;

    // The public façade should simply return the input value.
    const result = await schema["~standard"].validate("hello");
    expect(result).toEqual({ value: "hello" });

    // Internally, `_zod.run` should just forward to `_zod.parse`.
    // Because we have no real parser, we can only assert that `run` exists.
    expect(typeof schema._zod.run).toBe("function");
  });

  /* -------------------------------------------------------------- */
  /* 2️⃣  Simple synchronous check that adds an issue */
  /* -------------------------------------------------------------- */
  it("should run a synchronous check and return issues", async () => {
    const failingCheck = createMockCheck({
      check: (payload) => {
        payload.issues.push({ code: "custom_error", message: "failed" });
      },
    });

    const schema = new ($ZodType as any)({
      type: "string",
      checks: [failingCheck],
    }) as any;

    // Run the internal parser directly to see the raw payload.
    const raw = await schema._zod.run(makePayload("any"), { async: true });
    expect(raw.issues).toHaveLength(1);
    expect(raw.issues[0].code).toBe("custom_error");

    // The public façade should surface the same issue.
    const result = await schema["~standard"].validate("any");
    expect(result).toEqual({ issues: [{ code: "custom_error", message: "failed" }] });
  });

  /* -------------------------------------------------------------- */
  /* 3️⃣  Conditional (`when`) check – should be skipped */
  /* -------------------------------------------------------------- */
  it("should skip a check when its `when` predicate returns false", async () => {
    const conditionalCheck = createMockCheck({
      when: (payload) => false, // never run
      check: (payload) => {
        payload.issues.push({ code: "should_not_appear" });
      },
    });

    const schema = new ($ZodType as any)({
      type: "string",
      checks: [conditionalCheck],
    }) as any;

    const raw = await schema._zod.run(makePayload("test"), { async: true });
    expect(raw.issues).toHaveLength(0);
  });

  /* -------------------------------------------------------------- */
  /* 4️⃣  Abort after first issue – subsequent checks are ignored */
  /* -------------------------------------------------------------- */
  it("should abort further checks after the first issue is added", async () => {
    const firstCheck = createMockCheck({
      check: (payload) => {
        payload.issues.push({ code: "first" });
      },
    });

    const secondCheck = createMockCheck({
      check: (payload) => {
        payload.issues.push({ code: "second" });
      },
    });

    const schema = new ($ZodType as any)({
      type: "string",
      checks: [firstCheck, secondCheck],
    }) as any;

    const raw = await schema._zod.run(makePayload("x"), { async: true });
    // Only the first issue should be present.
    expect(raw.issues).toHaveLength(1);
    expect(raw.issues[0].code).toBe("first");
  });

  /* -------------------------------------------------------------- */
  /* 5️⃣  Async check with sync context – should throw $ZodAsyncError */
  /* -------------------------------------------------------------- */
  it("should throw $ZodAsyncError when an async check runs in sync mode", async () => {
    // The async check simply resolves after a tick.
    const asyncCheck = createMockCheck({
      check: async (payload) => {
        await new Promise((r) => setTimeout(r, 0));
        payload.issues.push({ code: "async_issue" });
      },
    });

    const schema = new ($ZodType as any)({
      type: "string",
      checks: [asyncCheck],
    }) as any;

    // The internal `$ZodAsyncError` class lives under `core`.
    // We import it lazily to avoid a circular import in the test file.
    const { $ZodAsyncError } = await import("./$ZodType"); // adjust path if needed

    // Call the internal `run` with a *sync* context.
    const syncCtx = { async: false };
    await expect(() => schema._zod.run(makePayload("x"), syncCtx)).rejects.toBeInstanceOf(
      $ZodAsyncError
    );
  });

  /* -------------------------------------------------------------- */
  /* 6️⃣  `~standard.validate` fallback to async when sync throws */
  /* -------------------------------------------------------------- */
  it("should fallback to the async path when the sync validation throws", async () => {
    // A check that returns a Promise – this forces the sync path to throw.
    const asyncCheck = createMockCheck({
      check: async (payload) => {
        await new Promise((r) => setTimeout(r, 0));
        payload.issues.push({ code: "async_fallback" });
      },
    });

    const schema = new ($ZodType as any)({
      type: "string",
      checks: [asyncCheck],
    }) as any;

    // `validate` should *not* throw; it must return a Promise that resolves
    // to the issues object.
    const resultPromise = schema["~standard"].validate("any");
    // The return type is either a plain object (sync) or a Promise (async fallback).
    expect(resultPromise).toBeInstanceOf(Promise);

    const result = await resultPromise;
    expect(result).toEqual({ issues: [{ code: "async_fallback" }] });
  });

  /* -------------------------------------------------------------- */
  /* 7️⃣  Attach‑time side‑effect (`onattach`) is executed */
  /* -------------------------------------------------------------- */
  it("should execute `onattach` callbacks when the schema is constructed", () => {
    let attached = false;
    const checkWithOnAttach = createMockCheck({
      onattach: [(inst) => (attached = true)],
      check: () => {}, // no‑op
    });

    // Instantiating the schema should run the `onattach` callback.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = new ($ZodType as any)({
      type: "string",
      checks: [checkWithOnAttach],
    }) as any;

    expect(attached).toBe(true);
  });
});
