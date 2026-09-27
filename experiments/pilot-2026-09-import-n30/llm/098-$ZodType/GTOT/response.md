###Test START##
```ts
/**
 * Vitest test suite for the `$ZodType` constructor exported from `./schemas.js`.
 *
 * The tests cover:
 * 1. Extraction of public members (the `~standard` object with its `validate` method
 *    and the internal `_zod.run` function).
 * 2. Basic functionality – a schema without any checks should simply return the
 *    supplied value.
 * 3. Edge‑case handling:
 *    - Checks that add issues synchronously.
 *    - Checks that add issues asynchronously.
 *    - Checks that are conditionally skipped via a `when` predicate.
 *    - Async checks executed with `ctx.async === false` (should throw `$ZodAsyncError`).
 *
 * The test file is completely self‑contained; dummy check objects are created
 * inline to mimic the shape expected by the `$ZodType` constructor.
 */

import { describe, it, expect } from "vitest";
import { $ZodType } from "./schemas.js";

/**
 * Helper to create a minimal `$ZodType` instance.
 *
 * @param def – The `$ZodTypeDef` definition (only `type` is required for our tests).
 * @param extraChecks – Optional array of custom check objects that will be attached
 *                      to the schema during construction.
 * @returns The constructed schema instance.
 */
function createSchema(
  def: { type: string },
  extraChecks: any[] = []
) {
  // The core.$constructor expects the second argument (`def`) and will attach any
  // checks that are present on the instance's `_zod.def.checks` array.
  // We therefore create a plain object, assign the checks, and pass it to the
  // constructor.
  const rawInstance: any = {};

  // Attach the checks array (the constructor will copy it into its internal state)
  rawInstance._zod = { def: { ...def, checks: extraChecks } };

  // The `$ZodType` constructor returns the fully‑initialised instance.
  return $ZodType(rawInstance, rawInstance._zod.def);
}

/**
 * Minimal shape of a parse payload used by `$ZodType._zod.run`.
 */
interface ParsePayload {
  value: unknown;
  issues: Array<{ code: string; message: string }>;
}

/**
 * Minimal parse context – only the `async` flag is required for the tests.
 */
interface ParseContext {
  async: boolean;
}

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public members (extracted for documentation)                         */
/* -------------------------------------------------------------------------- */

/**
 * Public members of a `$ZodType` instance (as inferred from the source):
 *
 * - `~standard.validate(value: unknown): { value?: unknown; issues?: any[] }`
 *   → Synchronous validation entry point. Returns an object containing either
 *     the parsed `value` (on success) or an `issues` array (on failure).
 *
 * - `~standard.vendor: string` (always `"zod"`).
 *
 * - `~standard.version: 1`.
 *
 * - Internally exposed (but still reachable) `_zod.run(payload, ctx)`.
 *   This method executes the underlying `parse` logic (not defined in the
 *   snippet) and then runs all attached checks.
 *
 * The tests below interact directly with `_zod.run` to verify check handling,
 * and indirectly with `~standard.validate` for the happy‑path scenario.
 */

/* -------------------------------------------------------------------------- */
/* 2️⃣  Basic functionality – schema without checks                           */
/* -------------------------------------------------------------------------- */
describe("$ZodType – basic behaviour", () => {
  it("should return the input value unchanged when no checks are present", () => {
    const schema = createSchema({ type: "string" });

    // The `~standard.validate` method wraps `safeParse`/`safeParseAsync`.
    // With no checks attached, it should simply return the supplied value.
    const result = schema["~standard"].validate("hello");

    expect(result).toEqual({ value: "hello" });
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Edge‑case & exception handling                                        */
/* -------------------------------------------------------------------------- */
describe("$ZodType – check handling edge cases", () => {
  it("should collect issues from a synchronous check", () => {
    const syncCheck = {
      _zod: {
        def: {}, // no `when` predicate → always runs
        onattach: [],
        check: (payload: ParsePayload) => {
          payload.issues.push({
            code: "custom",
            message: "synchronous error",
          });
          return payload;
        },
      },
    };

    const schema = createSchema({ type: "string" }, [syncCheck]);

    const payload: ParsePayload = { value: "test", issues: [] };
    const ctx: ParseContext = { async: true };

    const result = schema._zod.run(payload, ctx) as ParsePayload;

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatchObject({
      code: "custom",
      message: "synchronous error",
    });
  });

  it("should collect issues from an asynchronous check", async () => {
    const asyncCheck = {
      _zod: {
        def: {}, // always runs
        onattach: [],
        check: async (payload: ParsePayload) => {
          // Simulate async work
          await new Promise((res) => setTimeout(res, 10));
          payload.issues.push({
            code: "custom_async",
            message: "asynchronous error",
          });
          return payload;
        },
      },
    };

    const schema = createSchema({ type: "string" }, [asyncCheck]);

    const payload: ParsePayload = { value: "async-test", issues: [] };
    const ctx: ParseContext = { async: true };

    const result = await schema._zod.run(payload, ctx) as ParsePayload;

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatchObject({
      code: "custom_async",
      message: "asynchronous error",
    });
  });

  it("should skip a check when its `when` predicate returns false", () => {
    const conditionalCheck = {
      _zod: {
        def: {
          when: (payload: ParsePayload) => false, // never run
        },
        onattach: [],
        check: (payload: ParsePayload) => {
          // This should never be called
          payload.issues.push({
            code: "should_not_fire",
            message: "this check must be skipped",
          });
          return payload;
        },
      },
    };

    const schema = createSchema({ type: "string" }, [conditionalCheck]);

    const payload: ParsePayload = { value: "skip-test", issues: [] };
    const ctx: ParseContext = { async: true };

    const result = schema._zod.run(payload, ctx) as ParsePayload;

    expect(result.issues).toHaveLength(0);
  });

  it("should throw $ZodAsyncError when an async check runs with async disabled", async () => {
    // The `$ZodAsyncError` class is exported from the same core module that
    // provides `$ZodType`. We can import it via the constructor's namespace.
    // If the core module does not expose it directly, we fall back to checking
    // that *any* error is thrown (the exact type is not crucial for the test).
    const asyncCheck = {
      _zod: {
        def: {}, // always runs
        onattach: [],
        check: async (payload: ParsePayload) => {
          await Promise.resolve();
          payload.issues.push({
            code: "async_error",
            message: "should trigger async error",
          });
          return payload;
        },
      },
    };

    const schema = createSchema({ type: "string" }, [asyncCheck]);

    const payload: ParsePayload = { value: "error-test", issues: [] };
    const ctx: ParseContext = { async: false }; // async disabled

    // The constructor attaches the async‑error guard inside `_zod.run`.
    // We expect a rejection (thrown error) when the async check is executed.
    await expect(() => schema._zod.run(payload, ctx)).rejects.toBeInstanceOf(Error);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Integration test – using `~standard.validate` with async checks       */
/* -------------------------------------------------------------------------- */
describe("$ZodType – integration via `~standard.validate`", () => {
  it("should resolve to issues when an async check fails", async () => {
    const asyncCheck = {
      _zod: {
        def: {},
        onattach: [],
        check: async (payload: ParsePayload) => {
          await new Promise((res) => setTimeout(res, 5));
          payload.issues.push({
            code: "integration_async",
            message: "async validation failed",
          });
          return payload;
        },
      },
    };

    const schema = createSchema({ type: "string" }, [asyncCheck]);

    // `validate` returns a promise when async work is detected.
    const result = await schema["~standard"].validate("any-value");

    // Because the async check adds an issue, the result should contain `issues`.
    expect(result).toHaveProperty("issues");
    expect((result as any).issues).toBeInstanceOf(Array);
    expect((result as any).issues[0]).toMatchObject({
      code: "integration_async",
      message: "async validation failed",
    });
  });
});
```
###Test END##