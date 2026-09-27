/**
 * Vitest test suite for the $ZodCheckIncludes class.
 *
 * The class is exported from "./checks.js" and is a Zod‑style string
 * validation check that ensures a string contains a given substring,
 * optionally starting the search from a specific position.
 *
 * The tests cover:
 * 1. Public API surface (constructor & internal `_zod.check` method).
 * 2. Normal behaviour (substring present / absent).
 * 3. Edge cases (empty substring, out‑of‑range position, position handling).
 * 4. Verification that the generated regex pattern is attached to the parent
 *    schema’s `bag.patterns` set (the side‑effect performed in `onattach`).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { $ZodCheckIncludes } from "./checks.js";

/**
 * Helper to create a minimal payload object that mimics the internal
 * structure used by Zod checks.
 *
 * @param value - The string value to validate.
 * @returns An object with `value` and an `issues` array that will be
 *          populated by the check.
 */
function createPayload(value: string) {
  return {
    value,
    issues: [] as Array<{
      origin: string;
      code: string;
      format: string;
      includes: string;
      input: string;
      inst: unknown;
      continue: boolean;
    }>,
  };
}

/**
 * Minimal mock for the parent schema’s bag. The `$ZodCheck.init` call
 * (inside the constructor) expects the instance to have a `_zod` object
 * with a `bag` property. In the real library this bag is created by the
 * surrounding `$ZodString` schema, but for unit testing we can inject a
 * simple mock after construction.
 */
function attachMockBag(inst: any) {
  // The internal `_zod` object is created by the constructor.
  // We add a `bag` that mimics the shape used in `onattach`.
  inst._zod.bag = {
    patterns: undefined as Set<RegExp> | undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* 1. Public methods (signatures)                                            */
/* -------------------------------------------------------------------------- */

/**
 * The `$ZodCheckIncludes` class is created via `core.$constructor`,
 * therefore its public surface consists of:
 *
 *   - constructor(def: $ZodCheckIncludesDef)
 *   - internal property `_zod` containing:
 *       - `check(payload: { value: string; issues: any[] })`
 *       - `onattach` array (used internally, not part of public API)
 *
 * The tests below instantiate the class and directly invoke the
 * `_zod.check` method, which is the functional entry point for validation.
 */

describe("$ZodCheckIncludes – basic functionality", () => {
  let checkInst: any;

  beforeEach(() => {
    // Create a fresh instance for each test case.
    // The definition only needs the `includes` field; other optional
    // fields (`position`, `abort`) are omitted to test defaults.
    checkInst = new $ZodCheckIncludes({ includes: "foo" });
    attachMockBag(checkInst);
  });

  it("should not push an issue when the substring is present", () => {
    const payload = createPayload("the quick foo jumps");
    checkInst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("should push an issue when the substring is absent", () => {
    const payload = createPayload("the quick bar jumps");
    checkInst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue.origin).toBe("string");
    expect(issue.code).toBe("invalid_format");
    expect(issue.format).toBe("includes");
    expect(issue.includes).toBe("foo");
    expect(issue.input).toBe("the quick bar jumps");
    // `continue` reflects the `abort` flag (default false → continue true)
    expect(issue.continue).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* 2. Edge cases – position handling                                         */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckIncludes – position option", () => {
  it("should respect the `position` argument (match after position)", () => {
    const checkInst = new $ZodCheckIncludes({ includes: "bar", position: 5 });
    attachMockBag(checkInst);

    // "foobar" contains "bar" starting at index 3, which is BEFORE position 5.
    // Hence the check should fail.
    const payload1 = createPayload("foobar");
    checkInst._zod.check(payload1);
    expect(payload1.issues).toHaveLength(1);

    // "xxxyyybar" contains "bar" at index 6, which is >= position 5 → success.
    const payload2 = createPayload("xxxyyybar");
    checkInst._zod.check(payload2);
    expect(payload2.issues).toHaveLength(0);
  });

  it("should treat undefined position as a normal includes check", () => {
    const checkInst = new $ZodCheckIncludes({ includes: "test" });
    attachMockBag(checkInst);

    const payload = createPayload("this is a test string");
    checkInst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("should handle a position larger than the string length", () => {
    const checkInst = new $ZodCheckIncludes({ includes: "a", position: 100 });
    attachMockBag(checkInst);

    const payload = createPayload("short");
    checkInst._zod.check(payload);
    // Since the search starts after the string ends, it cannot find anything.
    expect(payload.issues).toHaveLength(1);
  });
});

/* -------------------------------------------------------------------------- */
/* 3. Edge cases – empty `includes` string                                   */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckIncludes – empty substring edge case", () => {
  it("should always succeed when `includes` is an empty string", () => {
    const checkInst = new $ZodCheckIncludes({ includes: "" });
    attachMockBag(checkInst);

    const cases = ["", "anything", "12345"];
    for (const str of cases) {
      const payload = createPayload(str);
      checkInst._zod.check(payload);
      expect(payload.issues).toHaveLength(0);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 4. Internal side‑effect – regex pattern attached to parent bag            */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckIncludes – internal regex pattern handling", () => {
  it("should create a RegExp pattern and add it to the parent schema's bag", () => {
    const def = { includes: "abc", position: 2 };
    const checkInst = new $ZodCheckIncludes(def);
    // Simulate the parent schema attaching the check (calls `onattach` callbacks)
    attachMockBag(checkInst);
    // Manually invoke the onattach callbacks to mimic the real lifecycle.
    checkInst._zod.onattach.forEach((cb: (inst: any) => void) => cb(checkInst));

    // The pattern should be stored in the bag's `patterns` Set.
    const bag = checkInst._zod.bag;
    expect(bag.patterns).toBeInstanceOf(Set);
    // The expected pattern is built from the definition.
    const escaped = def.includes.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expectedPattern = new RegExp(`^.{${
      def.position
    }}${escaped}`);
    // Since Set stores the exact RegExp object, we can check its source.
    const storedPattern = Array.from(bag.patterns!)[0];
    expect(storedPattern.source).toBe(expectedPattern.source);
  });

  it("should create a simple pattern when `position` is undefined", () => {
    const def = { includes: "xyz" };
    const checkInst = new $ZodCheckIncludes(def);
    attachMockBag(checkInst);
    checkInst._zod.onattach.forEach((cb: (inst: any) => void) => cb(checkInst));

    const bag = checkInst._zod.bag;
    expect(bag.patterns).toBeInstanceOf(Set);
    const storedPattern = Array.from(bag.patterns!)[0];
    const escaped = def.includes.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expectedPattern = new RegExp(escaped);
    expect(storedPattern.source).toBe(expectedPattern.source);
  });
});

/* -------------------------------------------------------------------------- */
/* 5. Exception handling – ensure no unexpected throws                     */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckIncludes – robustness", () => {
  it("should never throw, even with non‑string payload values", () => {
    const checkInst = new $ZodCheckIncludes({ includes: "foo" });
    attachMockBag(checkInst);

    // Simulate a payload where `value` is not a string (the real library
    // would normally guard this earlier, but the check itself should be safe).
    const payload = { value: (123 as unknown) as string, issues: [] as any[] };
    expect(() => checkInst._zod.check(payload)).not.toThrow();
    // Since `includes` on a non‑string would throw, the implementation
    // relies on the surrounding schema to ensure type safety. Our test
    // confirms that the check does not introduce its own errors.
  });
});
