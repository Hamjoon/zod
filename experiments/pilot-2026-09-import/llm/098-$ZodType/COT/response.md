**Explanation**

The `$ZodType` export is a *constructor* that builds a Zod‑like schema object.  
The public API that can be exercised from the outside is the `~standard` object
which contains a `validate` method. Internally the constructor also creates a
`_zod.run` method that executes the user‑provided checks (synchronous or
asynchronous) after the core `parse` step.

The test suite therefore focuses on:

1. **Basic construction** – a schema can be created and its `~standard.validate`
   method works when no checks are present.
2. **Running checks** – the internal `_zod.run` method correctly processes
   synchronous checks.
3. **Asynchronous checks** – the run method returns a `Promise`, the async check
   is awaited and its issues are added to the payload.
4. **Async‑disabled context** – when `ctx.async === false` an asynchronous check
   must throw a `$ZodAsyncError`.
5. **Conditional checks** – a check with a `when` predicate that returns
   `false` is skipped.
6. **Edge cases** – empty check list (deferred initializer) and proper handling
   of the `validate` method when the underlying parse is synchronous vs.
   asynchronous.

Because the real parsing logic lives elsewhere in the library, the tests
*mock* the low‑level `parse` function and create minimal “check” objects that
conform to the shape expected by the constructor (`_zod.def`, `_zod.onattach`,
`_zod.check`). This keeps the tests fast, deterministic and focused on the
behaviour of `$ZodType` itself.

---

### Complete Vitest test file (`$ZodType.test.ts`)

```ts
###Test START##
import { describe, it, expect } from "vitest";
import { $ZodType } from "./schemas.js";

/**
 * Helper to create a minimal $ZodCheck‑like object.
 *
 * @param fn   The function that will be called as the check. It receives the
 *             payload and may mutate it (e.g. push issues). It can return a
 *             Promise for async checks.
 * @param when Optional predicate that decides whether the check should run.
 */
function makeCheck(
  fn: (payload: any) => any,
  when?: (payload: any) => boolean
) {
  return {
    // The constructor looks for `_zod.def.when`
    _zod: {
      def: { when },
      // `onattach` is iterated but not used in our tests
      onattach: [] as any[],
      // The actual check implementation
      check: fn,
    },
  };
}

/**
 * Minimal payload shape used by the constructor.
 * `issues` is an array that the checks push into.
 * `value` is the raw input value.
 * `data` will be filled by our mocked `parse` implementation.
 */
type Payload = {
  value: unknown;
  issues: any[];
  data?: unknown;
};

describe("$ZodType constructor & runtime behaviour", () => {
  /** --------------------------------------------------------------------
   *  1️⃣  Basic construction – no checks, synchronous parse
   * ------------------------------------------------------------------- */
  it("creates a schema and validates synchronously when no checks are present", () => {
    // Build a schema with an empty check list
    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [],
    });

    // Mock the low‑level parse – simply copies the input value to `data`
    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    // `~standard.validate` should return the parsed value
    const result = schema["~standard"].validate("hello");
    expect(result).toEqual({ value: "hello" });
  });

  /** --------------------------------------------------------------------
   *  2️⃣  Synchronous check execution
   * ------------------------------------------------------------------- */
  it("runs a synchronous check and adds an issue when the check fails", () => {
    const syncCheck = makeCheck((payload: Payload) => {
      // Simulate a failing check by pushing an issue
      payload.issues.push({ code: "custom_error", message: "failed" });
      return payload;
    });

    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [syncCheck],
    });

    // Mock parse – returns a clean payload (no issues)
    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    const payload: Payload = { value: "test", issues: [] };
    const result = schema._zod.run(payload, {});

    // Because the check is sync, `run` returns the payload directly
    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0]).toMatchObject({
      code: "custom_error",
    });
  });

  /** --------------------------------------------------------------------
   *  3️⃣  Asynchronous check handling
   * ------------------------------------------------------------------- */
  it("awaits an asynchronous check and propagates its issues", async () => {
    const asyncCheck = makeCheck(async (payload: Payload) => {
      // Simulate async work (e.g. a network call)
      await new Promise((res) => setTimeout(res, 10));
      payload.issues.push({ code: "async_error", message: "async fail" });
      return payload;
    });

    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [asyncCheck],
    });

    // Mock parse – same as before
    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    const payload: Payload = { value: "async", issues: [] };
    const result = schema._zod.run(payload, { async: true });

    // `run` must return a Promise because the check is async
    expect(result).toBeInstanceOf(Promise);
    const finalPayload = await result;
    expect(finalPayload.issues).toHaveLength(1);
    expect(finalPayload.issues[0]).toMatchObject({
      code: "async_error",
    });
  });

  /** --------------------------------------------------------------------
   *  4️⃣  Async‑disabled context – should throw $ZodAsyncError
   * ------------------------------------------------------------------- */
  it("throws $ZodAsyncError when an async check runs with ctx.async === false", async () => {
    const asyncCheck = makeCheck(async (payload: Payload) => {
      payload.issues.push({ code: "should_not_run" });
      return payload;
    });

    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [asyncCheck],
    });

    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    const payload: Payload = { value: "no‑async", issues: [] };

    // The constructor uses `core.$ZodAsyncError`. It is not exported, but we can
    // assert that *any* error is thrown and that its name contains "ZodAsync".
    await expect(() => schema._zod.run(payload, { async: false })).rejects.toThrow(
      /ZodAsync/
    );
  });

  /** --------------------------------------------------------------------
   *  5️⃣  Conditional check (`when`) – should be skipped when predicate is false
   * ------------------------------------------------------------------- */
  it("skips a check whose `when` predicate returns false", () => {
    const conditionalCheck = makeCheck(
      (payload: Payload) => {
        payload.issues.push({ code: "should_be_skipped" });
        return payload;
      },
      // `when` returns false for every payload → the check must be ignored
      () => false
    );

    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [conditionalCheck],
    });

    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    const payload: Payload = { value: "skip", issues: [] };
    const result = schema._zod.run(payload, {});

    expect(result).toBe(payload);
    // No issues should have been added because the check was skipped
    expect(payload.issues).toHaveLength(0);
  });

  /** --------------------------------------------------------------------
   *  6️⃣  `~standard.validate` works with async checks (returns a Promise)
   * ------------------------------------------------------------------- */
  it("`~standard.validate` returns a Promise when async checks are present", async () => {
    const asyncCheck = makeCheck(async (payload: Payload) => {
      await new Promise((res) => setTimeout(res, 5));
      payload.issues.push({ code: "async_issue" });
      return payload;
    });

    const schema = $ZodType(undefined as any, {
      type: "string",
      checks: [asyncCheck],
    });

    // Mock the core parse – just forwards the value
    schema._zod.parse = (payload: Payload) => ({
      ...payload,
      data: payload.value,
      issues: [],
    });

    // `validate` will internally call `safeParse` which uses the mocked parse.
    // Because we have an async check, the result is a Promise.
    const result = schema["~standard"].validate("any");
    // The return type is either `{value}` or `{issues}`; when async it is a Promise.
    expect(result).toBeInstanceOf(Promise);
    const resolved = await result;
    expect(resolved).toEqual({ issues: [{ code: "async_issue" }] });
  });
});
###Test END##
```