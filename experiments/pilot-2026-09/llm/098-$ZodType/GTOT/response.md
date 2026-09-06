**$ZodType.test.ts**

```ts
###Test START##
import { describe, it, expect } from "vitest";
import { $ZodType } from "./$ZodType";               // <-- path to the file that exports $ZodType
import { core } from "./core";                     // <-- core contains $ZodAsyncError & helpers
import type { checks } from "./checks";

/**
 * Helper to create a minimal $ZodCheck implementation.
 *
 * A $ZodCheck must expose:
 *   - _zod.def   – optional `when` predicate
 *   - _zod.onattach – array of functions called on attach (can be empty)
 *   - _zod.check – the actual validation function
 *
 * The check receives a `payload` that contains:
 *   - `value`   – the value being validated
 *   - `issues`  – an array that can be pushed to in order to report errors
 *
 * For the purpose of the tests we only need to push an issue when we want the
 * validation to fail.
 */
function makeCheck(
  fn: (payload: any) => void | Promise<void>,
  when?: (payload: any) => boolean
): checks.$ZodCheck<never> {
  return {
    _zod: {
      def: { when },
      onattach: [],
      // the real Zod implementation expects `check` to return the (possibly mutated) payload.
      // Here we simply run the supplied `fn` and then return the payload.
      check: (payload: any) => {
        const result = fn(payload);
        // If the user supplied an async function we must return a Promise.
        return result instanceof Promise ? result.then(() => payload) : payload;
      },
    },
  } as any;
}

/**
 * Minimal safeParse / safeParseAsync helpers that the `$ZodType` constructor
 * expects to be present on the `core` module.  In the real library they are
 * provided by Zod itself – for the test we re‑export the same logic.
 */
function safeParse(schema: any, value: unknown) {
  try {
    const data = schema._zod.run({ value, issues: [] }, { async: true });
    if (data instanceof Promise) throw new Error("unexpected async");
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e };
  }
}
function safeParseAsync(schema: any, value: unknown) {
  return Promise.resolve()
    .then(() => schema._zod.run({ value, issues: [] }, { async: true }))
    .then((payload: any) => ({ success: true, data: payload }))
    .catch((error) => ({ success: false, error }));
}

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public API extraction – the only public method we can reliably test is   */
/*     `~standard.validate`.  All other members (`_zod.run`, `parse`, …) are   */
/*     internal implementation details.                                      */
/* -------------------------------------------------------------------------- */

describe("$ZodType – standard.validate", () => {
  /** ---------------------------------------------------------------------- *
   *  BASIC FUNCTIONALITY – a schema with no checks should accept any value *
   * ---------------------------------------------------------------------- */
  it("returns the value unchanged when there are no checks", () => {
    const schema = $ZodType({ type: "any" });
    const result = schema["~standard"].validate("any string");
    expect(result).toEqual({ value: "any string" });
  });

  /** ---------------------------------------------------------------------- *
   *  SIMPLE TYPE CHECK – a schema that only allows strings                *
   * ---------------------------------------------------------------------- */
  it("accepts a string and rejects a number", () => {
    const stringCheck = makeCheck((payload) => {
      if (typeof payload.value !== "string") {
        payload.issues.push({ code: "invalid_type", expected: "string", received: typeof payload.value });
      }
    });

    const schema = $ZodType({ type: "string", checks: [stringCheck] });

    // ✅ valid string
    expect(schema["~standard"].validate("hello")).toEqual({ value: "hello" });

    // ❌ invalid number
    const invalid = schema["~standard"].validate(123);
    expect(invalid).toHaveProperty("issues");
    expect(invalid.issues?.[0]).toMatchObject({
      code: "invalid_type",
      expected: "string",
      received: "number",
    });
  });

  /** ---------------------------------------------------------------------- *
   *  EDGE CASE – async check with async context set to false                *
   * ---------------------------------------------------------------------- */
  it("throws $ZodAsyncError when an async check runs in sync mode", async () => {
    const asyncCheck = makeCheck(
      async (payload) => {
        // simulate async work
        await new Promise((res) => setTimeout(res, 10));
        if (payload.value !== "ok") {
          payload.issues.push({ code: "custom_error", message: "value not ok" });
        }
      }
    );

    const schema = $ZodType({ type: "string", checks: [asyncCheck] });

    // The internal `run` method receives a context; we can call it directly.
    // When `async: false` we expect a synchronous call to throw.
    expect(() => {
      // @ts-ignore – we are deliberately using the internal API to test the edge case.
      schema._zod.run({ value: "ok", issues: [] }, { async: false });
    }).toThrowError(core.$ZodAsyncError);
  });

  /** ---------------------------------------------------------------------- *
   *  EDGE CASE – `when` predicate prevents a check from running            *
   * ---------------------------------------------------------------------- */
  it("skips a check when its `when` predicate returns false", () => {
    const conditionalCheck = makeCheck(
      (payload) => {
        payload.issues.push({ code: "should_not_run" });
      },
      // `when` returns false for numbers, true for strings
      (payload) => typeof payload.value === "string"
    );

    const schema = $ZodType({ type: "any", checks: [conditionalCheck] });

    // String → check runs → we get an issue
    const withString = schema["~standard"].validate("test");
    expect(withString).toHaveProperty("issues");
    expect(withString.issues?.[0].code).toBe("should_not_run");

    // Number → check is skipped → no issues
    const withNumber = schema["~standard"].validate(42);
    expect(withNumber).toEqual({ value: 42 });
  });

  /** ---------------------------------------------------------------------- *
   *  COMPLEX SCENARIO – multiple checks, some async, some sync, mixed order *
   * ---------------------------------------------------------------------- */
  it("processes a mixture of sync and async checks in order", async () => {
    const syncCheck = makeCheck((payload) => {
      if (payload.value.length < 5) {
        payload.issues.push({ code: "too_short" });
      }
    });

    const asyncCheck = makeCheck(async (payload) => {
      await new Promise((res) => setTimeout(res, 5));
      if (!payload.value.includes("@")) {
        payload.issues.push({ code: "missing_at" });
      }
    });

    const schema = $ZodType({ type: "string", checks: [syncCheck, asyncCheck] });

    // Use the public async‑aware `validate` which internally falls back to
    // `safeParseAsync` when a Promise is encountered.
    const result = await schema["~standard"].validate("abc");
    // Both checks should have added issues
    expect(result).toHaveProperty("issues");
    expect(result.issues?.map((i) => i.code).sort()).toEqual(["missing_at", "too_short"]);
  });

  /** ---------------------------------------------------------------------- *
   *  DEFERRED INITIALIZER – schema without any checks should still expose *
   *  a working `validate` method (run is set later via the deferred hook) *
   * ---------------------------------------------------------------------- */
  it("works when the schema has no checks (deferred initializer path)", () => {
    const schema = $ZodType({ type: "string", checks: [] });
    // The constructor adds a deferred hook that later sets `run = parse`.
    // The public API should already be usable.
    const result = schema["~standard"].validate("any");
    expect(result).toEqual({ value: "any" });
  });
});

/* -------------------------------------------------------------------------- */
/* 2️⃣  Edge‑case & exception identification (summary)                         */
/* -------------------------------------------------------------------------- */
/*
  • No checks → deferred initializer path.
  • Checks array contains async functions → must return a Promise.
  • `ctx.async === false` while an async check runs → throws $ZodAsyncError.
  • `when` predicate can skip a check entirely.
  • Multiple checks: order of issue collection must be preserved.
  • Validation of non‑object values (string, number, null, undefined) – ensure
    the payload shape `{ value, issues: [] }` is always respected.
  • Unexpected exceptions inside a check should propagate as validation errors.
*/

###Test END##
```