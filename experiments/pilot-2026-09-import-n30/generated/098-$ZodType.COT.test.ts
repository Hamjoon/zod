import { describe, it, expect } from "vitest";
import { $ZodType } from "./schemas.js";

/**
 * Helper to create a minimal schema instance.
 *
 * The constructor signature is `(inst?, def)`.  Passing `undefined` for `inst`
 * forces the constructor to create a fresh object.  Afterwards we stub
 * `inst._zod.parse` with an identity function so that the validation pipeline
 * can run without needing the real parsing implementation.
 */
function createSchema(def: any) {
  // The constructor returns the instance (the first argument is mutated in‑place)
  const schema: any = $ZodType(undefined, def);
  // Stub parse – simply returns the payload unchanged.
  schema._zod.parse = (payload: any) => payload;
  return schema;
}

/**
 * Minimal dummy check that always pushes a custom issue.
 */
function makeFailingCheck(message = "failed"): any {
  return {
    _zod: {
      def: {}, // no `when` – always runs
      onattach: [],
      check: (payload: any) => {
        payload.issues.push({ code: "custom", message });
        return payload;
      },
    },
  };
}

/**
 * Dummy async check – resolves after a tick and pushes an issue.
 */
function makeAsyncFailingCheck(message = "async failed"): any {
  return {
    _zod: {
      def: {},
      onattach: [],
      check: async (payload: any) => {
        await new Promise((r) => setTimeout(r, 0));
        payload.issues.push({ code: "custom_async", message });
        return payload;
      },
    },
  };
}

/**
 * Conditional check – runs only when the supplied predicate returns true.
 */
function makeConditionalCheck(predicate: (payload: any) => boolean, message = "cond fail"): any {
  return {
    _zod: {
      def: {
        when: predicate,
      },
      onattach: [],
      check: (payload: any) => {
        payload.issues.push({ code: "conditional", message });
        return payload;
      },
    },
  };
}

/**
 * Helper to invoke the public façade validation.
 *
 * The façade returns a promise only when an async check is present.
 */
async function validate(schema: any, value: unknown) {
  const result = schema["~standard"].validate(value);
  // If the result is a Promise (async path) we await it.
  return result instanceof Promise ? await result : result;
}

/* -------------------------------------------------------------------------- */
/*                               PUBLIC METHODS                               */
/* -------------------------------------------------------------------------- */

/**
 * The only public method we can reliably test is the façade:
 *
 *   schema["~standard"].validate(value)
 *
 * It internally uses `safeParse` / `safeParseAsync` which ultimately call
 * `schema._zod.run`.  All other members (`_zod.run`, `_zod.parse`, etc.) are
 * internal, but we can still reach them for stubbing purposes.
 */

/* -------------------------------------------------------------------------- */
/*                               BASIC TESTS                                 */
/* -------------------------------------------------------------------------- */

describe("$ZodType – basic validation", () => {
  it("should return the value when no checks are present", async () => {
    const schema = createSchema({ type: "string", checks: [] });
    const out = await validate(schema, "hello");
    expect(out).toEqual({ value: "hello" });
  });

  it("should return issues when a synchronous failing check is attached", async () => {
    const schema = createSchema({
      type: "number",
      checks: [makeFailingCheck("number must be positive")],
    });
    const out = await validate(schema, -5);
    expect(out).toEqual({
      issues: [{ code: "custom", message: "number must be positive" }],
    });
  });
});

/* -------------------------------------------------------------------------- */
/*                               EDGE CASES                                   */
/* -------------------------------------------------------------------------- */

describe("$ZodType – edge cases & exception handling", () => {
  it("should handle an asynchronous failing check (default async context)", async () => {
    const schema = createSchema({
      type: "string",
      checks: [makeAsyncFailingCheck("must be async valid")],
    });
    const out = await validate(schema, "any");
    expect(out).toEqual({
      issues: [{ code: "custom_async", message: "must be async valid" }],
    });
  });

  it("should throw $ZodAsyncError when an async check runs with ctx.async === false", async () => {
    const schema = createSchema({
      type: "string",
      checks: [makeAsyncFailingCheck()],
    });

    // Manually invoke the internal run method with a sync‑only context.
    const payload = { value: "x", issues: [] };
    const ctx = { async: false };

    // The internal run method is built by the constructor.
    // It should throw core.$ZodAsyncError (or any error) when async is forbidden.
    expect(() => schema._zod.run(payload, ctx)).toThrowError();
  });

  it("should skip a conditional check when its predicate returns false", async () => {
    const alwaysFalse = () => false;
    const schema = createSchema({
      type: "any",
      checks: [makeConditionalCheck(alwaysFalse, "should not appear")],
    });
    const out = await validate(schema, 123);
    // No issues because the check never ran.
    expect(out).toEqual({ value: 123 });
  });

  it("should execute a conditional check when its predicate returns true", async () => {
    const alwaysTrue = () => true;
    const schema = createSchema({
      type: "any",
      checks: [makeConditionalCheck(alwaysTrue, "must run")],
    });
    const out = await validate(schema, "test");
    expect(out).toEqual({
      issues: [{ code: "conditional", message: "must run" }],
    });
  });

  it("should abort further checks after an issue is added when abortEarly is true (simulated)", async () => {
    // The library’s `util.aborted` logic aborts when `payload.issues` length grows.
    // We simulate this by adding two checks: the first adds an issue, the second
    // would add another issue if it were executed.
    const firstCheck = makeFailingCheck("first");
    const secondCheck = makeFailingCheck("second");
    const schema = createSchema({
      type: "any",
      checks: [firstCheck, secondCheck],
    });
    const out = await validate(schema, "value");
    // Only the first issue should be present because the runner aborts after the
    // first mutation of `issues`.
    expect(out).toEqual({
      issues: [{ code: "custom", message: "first" }],
    });
  });
});

/* -------------------------------------------------------------------------- */
/*                               INTERNAL STUBS                               */
/* -------------------------------------------------------------------------- */

/**
 * The constructor creates a *deferred* initializer when no checks are supplied.
 * In that situation `inst._zod.run` is not defined until the deferred callback
 * runs.  The test suite verifies that the deferred path still yields a working
 * `validate` method.
 */
describe("$ZodType – deferred initializer handling", () => {
  it("should correctly initialise deferred run when there are no checks", async () => {
    const schema = createSchema({ type: "string", checks: [] });
    // The constructor added a deferred callback that sets `run = parse`.
    // Because we stubbed `parse` with an identity function, `run` should be
    // effectively a no‑op.
    const out = await validate(schema, "deferred");
    expect(out).toEqual({ value: "deferred" });
  });
});
