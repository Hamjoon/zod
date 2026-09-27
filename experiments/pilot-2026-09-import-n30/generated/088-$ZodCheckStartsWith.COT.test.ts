/**
 * Vitest test suite for the `$ZodCheckStartsWith` class.
 *
 * The class is exported from `./checks.js`. It is created via `core.$constructor`
 * and therefore behaves like a constructor that receives a *definition* object.
 *
 * The public “API” we can reliably test is the internal `check` function that
 * is stored on the instance under `instance._zod.check`. This function receives a
 * *payload* object `{ value: unknown; issues: $ZodIssue[] }` and pushes an issue
 * when the supplied string does **not** start with the configured prefix.
 *
 * The tests below therefore:
 *   1. Instantiate `$ZodCheckStartsWith` with various definitions.
 *   2. Call the internal `check` method with crafted payloads.
 *   3. Verify that the payload’s `issues` array is either left untouched
 *      (valid case) or receives a correctly‑shaped issue (invalid case).
 *
 * Edge‑cases covered:
 *   - Empty prefix (should accept any string, including the empty string).
 *   - Value exactly equal to the prefix.
 *   - Value shorter than the prefix.
 *   - Non‑string values (the check still runs `startsWith` which throws,
 *     so we guard against that and expect an issue).
 *   - `abort` flag influencing the `continue` property of the issue.
 */

import { describe, it, expect } from "vitest";
import { $ZodCheckStartsWith } from "./checks.js";

/**
 * Helper to build a minimal payload object expected by the internal check.
 */
function makePayload(value: unknown) {
  return {
    value,
    issues: [] as any[], // the check pushes issue objects here
  };
}

/**
 * Utility to create an instance of `$ZodCheckStartsWith` with a given definition.
 * The definition type is fairly open, so we cast `any` to satisfy the compiler.
 */
function createSchema(def: Partial<{
  prefix: string;
  abort: boolean;
}> = {}) {
  // Provide a default prefix to avoid undefined behaviour in tests that don’t set it.
  const fullDef: any = {
    prefix: "default",
    abort: false,
    ...def,
  };
  // `core.$constructor` returns a class, so we can instantiate it with `new`.
  return new ($ZodCheckStartsWith as any)(fullDef);
}

/* -------------------------------------------------------------------------- */
/*  1️⃣  Public method extraction (for documentation purposes)                */
/* -------------------------------------------------------------------------- */

/**
 * The `$ZodCheckStartsWith` “class” does not expose many traditional methods.
 * Its public surface (as far as the test can interact with) consists of:
 *
 *   - `constructor(def: $ZodCheckStartsWithDef)`
 *       Creates a new check instance. The definition must contain at least
 *       a `prefix: string`. Optional `abort: boolean` influences issue handling.
 *
 *   - `instance._zod.check(payload: { value: unknown; issues: $ZodIssue[] })`
 *       Internal validation routine. It **does not** return a value; it mutates
 *       `payload.issues` when the supplied `value` does not start with the
 *       configured prefix.
 *
 * No other public methods are defined directly on the class; any additional
 * behaviour (e.g., `.parse`) would be provided by the `$ZodCheck` base class,
 * which is outside the scope of these tests.
 */

/* -------------------------------------------------------------------------- */
/*  2️⃣  Basic functionality tests                                            */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckStartsWith – basic behaviour", () => {
  it("passes when the string starts with the given prefix", () => {
    const schema = createSchema({ prefix: "hello" });
    const payload = makePayload("hello world");
    schema._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("fails and pushes an issue when the string does NOT start with the prefix", () => {
    const schema = createSchema({ prefix: "foo" });
    const payload = makePayload("barbaz");
    schema._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: "foo",
      input: "barbaz",
      inst: schema,
      continue: true, // default `abort` is false → continue = true
    });
  });

  it("respects the `abort` flag – `continue` becomes false when abort is true", () => {
    const schema = createSchema({ prefix: "xyz", abort: true });
    const payload = makePayload("notxyz");
    schema._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].continue).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  3️⃣  Edge‑case & exception handling tests                                 */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckStartsWith – edge cases & error handling", () => {
  it("accepts any string when the prefix is an empty string", () => {
    const schema = createSchema({ prefix: "" });
    const payload1 = makePayload("anything");
    const payload2 = makePayload("");
    schema._zod.check(payload1);
    schema._zod.check(payload2);
    expect(payload1.issues).toHaveLength(0);
    expect(payload2.issues).toHaveLength(0);
  });

  it("passes when the value is exactly equal to the prefix", () => {
    const schema = createSchema({ prefix: "exact" });
    const payload = makePayload("exact");
    schema._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("fails when the value is shorter than the prefix", () => {
    const schema = createSchema({ prefix: "longer" });
    const payload = makePayload("short");
    schema._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].prefix).toBe("longer");
  });

  it("handles non‑string values gracefully (adds an issue)", () => {
    const schema = createSchema({ prefix: "num" });
    const payload = makePayload(12345 as any);
    // The implementation calls `payload.value.startsWith`, which throws
    // if `value` is not a string. To keep the library robust, we expect the
    // check to catch this situation and push an issue rather than bubbling
    // an exception. If the implementation does not catch it, the test will
    // fail, highlighting a missing safeguard.
    expect(() => schema._zod.check(payload)).not.toThrow();
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].input).toBe(12345);
  });

  it("adds the generated RegExp pattern to the parent bag when attached", () => {
    // The constructor registers a pattern in `inst._zod.onattach`. To test this,
    // we simulate the attachment step by manually invoking the stored callbacks.
    const schema = createSchema({ prefix: "attach" });
    // The internal `onattach` array holds functions that receive the instance.
    const onAttachCallbacks = schema._zod.onattach as Array<(inst: any) => void>;
    // Prepare a mock parent schema that would receive the pattern.
    const parent = {
      _zod: {
        bag: {} as any,
      },
    };
    // Run each callback with the mock parent.
    onAttachCallbacks.forEach((cb) => cb(parent));
    // After attachment, the parent bag should contain a `patterns` Set with
    // the RegExp that matches the prefix.
    const patternsSet = (parent._zod.bag as any).patterns as Set<RegExp>;
    expect(patternsSet).toBeInstanceOf(Set);
    const expectedPattern = new RegExp(`^${"attach".replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`);
    expect(Array.from(patternsSet)).toContainEqual(expectedPattern);
  });
});

/* -------------------------------------------------------------------------- */
/*  4️⃣  Summary – all tests are combined into a single file                    */
/* -------------------------------------------------------------------------- */
