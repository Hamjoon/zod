/**
 * Vitest test suite for the `$ZodCheckIncludes` class.
 *
 * The tests cover:
 *  - Successful validation when the required substring is present.
 *  - Failure cases when the substring is missing.
 *  - Behaviour of the optional `position` argument (both as a search start index
 *    and as part of the generated RegExp pattern).
 *  - Correct handling of the `abort` flag (affects the `continue` property of
 *    the generated issue).
 *  - Proper escaping of special RegExp characters in the `includes` string.
 *  - Integration with the internal `bag.patterns` set that is populated on
 *    attachment.
 *
 * The test file assumes that the library’s internal helpers (`core`,
 * `util`, `errors`, `schemas`) are correctly exported and functional.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { $ZodCheckIncludes } from "./checks.js";

/**
 * Helper to create a minimal definition object for `$ZodCheckIncludes`.
 * The shape is deliberately kept loose (`as any`) because the full Zod
 * type hierarchy is not required for these unit tests.
 */
function makeDef(
  includes: string,
  opts?: {
    position?: number;
    abort?: boolean;
  }
) {
  return {
    includes,
    position: opts?.position,
    abort: opts?.abort ?? false,
    // The following properties are part of the broader `$ZodCheckStringFormatDef`
    // but are not used by `$ZodCheckIncludes`. They are added only to keep the
    // constructor happy.
    typeName: "ZodString",
    message: undefined,
    // placeholder for any other required fields
  } as any;
}

/**
 * Minimal payload structure expected by the `check` function.
 */
interface Payload {
  value: string;
  issues: any[];
}

/**
 * Extract the internal `bag` from an instance. The exact type is not
 * important for the tests – we only need to verify that the `patterns`
 * Set exists and contains the generated RegExp.
 */
function getBag(inst: any) {
  return (inst._zod?.bag ?? {}) as {
    patterns?: Set<RegExp>;
  };
}

/**
 * Run the `onattach` callbacks that the constructor registers.
 * In the real library this is performed by the surrounding schema,
 * but for isolated unit testing we invoke them manually.
 */
function runOnAttach(inst: any) {
  const callbacks = inst._zod?.onattach ?? [];
  callbacks.forEach((cb: (inst: any) => void) => cb(inst));
}

/* -------------------------------------------------------------------------- */
/*                               Test Suite                                   */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckIncludes", () => {
  let inst: any;

  beforeEach(() => {
    // Reset the instance before each test.
    inst = null;
  });

  /** --------------------------------------------------------------
   *  1️⃣ Basic inclusion – no `position`, default `abort = false`
   * -------------------------------------------------------------- */
  it("passes when the string includes the required substring (no position)", () => {
    const def = makeDef("hello");
    inst = new $ZodCheckIncludes(def);

    // Simulate attachment so that the pattern is stored in the bag.
    runOnAttach(inst);
    const bag = getBag(inst);
    expect(bag.patterns).toBeInstanceOf(Set);
    // The pattern should be a simple escaped RegExp for "hello".
    const storedPattern = Array.from(bag.patterns!)[0];
    expect(storedPattern).toBeInstanceOf(RegExp);
    expect(storedPattern.source).toBe("hello"); // no anchoring, no position

    // Payload that contains the substring.
    const payload: Payload = { value: "well, hello there!", issues: [] };
    inst._zod.check(payload);

    // No issues should be added.
    expect(payload.issues).toHaveLength(0);
  });

  /** --------------------------------------------------------------
   *  2️⃣ Failure case – substring missing
   * -------------------------------------------------------------- */
  it("adds an issue when the required substring is missing", () => {
    const def = makeDef("world");
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    const payload: Payload = { value: "hello there", issues: [] };
    inst._zod.check(payload);

    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: "world",
      input: payload.value,
      inst,
      continue: true, // abort is false by default
    });
  });

  /** --------------------------------------------------------------
   *  3️⃣ `abort` flag influences `continue` property
   * -------------------------------------------------------------- */
  it("sets `continue` to false when `abort` is true", () => {
    const def = makeDef("stop", { abort: true });
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    const payload: Payload = { value: "go ahead", issues: [] };
    inst._zod.check(payload);

    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].continue).toBe(false);
  });

  /** --------------------------------------------------------------
   *  4️⃣ Position argument – successful match starting at given index
   * -------------------------------------------------------------- */
  it("respects the `position` argument when the substring appears after that index", () => {
    const def = makeDef("abc", { position: 5 });
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    // The generated pattern should be anchored to start at exactly position 5.
    const bag = getBag(inst);
    const pattern = Array.from(bag.patterns!)[0];
    expect(pattern.source).toBe("^.{5}abc");

    // Value where "abc" starts at index 5 → should pass.
    const payloadPass: Payload = { value: "xxxxxabczzz", issues: [] };
    inst._zod.check(payloadPass);
    expect(payloadPass.issues).toHaveLength(0);

    // Value where "abc" appears earlier → should fail because search starts at 5.
    const payloadFail: Payload = { value: "abcxxxxx", issues: [] };
    inst._zod.check(payloadFail);
    expect(payloadFail.issues).toHaveLength(1);
    expect(payloadFail.issues[0].includes).toBe("abc");
  });

  /** --------------------------------------------------------------
   *  5️⃣ Position argument – using `String.prototype.includes` start index
   * -------------------------------------------------------------- */
  it("uses the second argument of `String.prototype.includes` as a start index", () => {
    const def = makeDef("foo", { position: 3 });
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    // "foo" appears at index 0 and 4; search should start at 3 → match at 4.
    const payload: Payload = { value: "foofoo", issues: [] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);

    // "foo" only before index 3 → should fail.
    const payload2: Payload = { value: "foo bar", issues: [] };
    inst._zod.check(payload2);
    expect(payload2.issues).toHaveLength(1);
  });

  /** --------------------------------------------------------------
   *  6️⃣ Edge case – empty `includes` string (should always pass)
   * -------------------------------------------------------------- */
  it("passes automatically when `includes` is an empty string", () => {
    const def = makeDef("");
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    const payload: Payload = { value: "anything", issues: [] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  /** --------------------------------------------------------------
   *  7️⃣ Regex‑special characters are escaped correctly in the stored pattern
   * -------------------------------------------------------------- */
  it("escapes regex meta‑characters in the generated RegExp pattern", () => {
    const special = "a+b*c?^$.[|]{}()\\";
    const def = makeDef(special);
    inst = new $ZodCheckIncludes(def);
    runOnAttach(inst);

    const bag = getBag(inst);
    const pattern = Array.from(bag.patterns!)[0];
    // util.escapeRegex should prefix each meta‑character with a backslash.
    // The exact escaped string can be verified by comparing with the
    // expected manual escape.
    const escaped = special
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // same logic as typical escape
    expect(pattern.source).toBe(escaped);
  });

  /** --------------------------------------------------------------
   *  8️⃣ Multiple attachments – pattern set should not duplicate entries
   * -------------------------------------------------------------- */
  it("adds the pattern to the bag only once even if `onattach` is called multiple times", () => {
    const def = makeDef("dup");
    inst = new $ZodCheckIncludes(def);

    // Call the attachment callbacks twice.
    runOnAttach(inst);
    runOnAttach(inst);

    const bag = getBag(inst);
    const patterns = bag.patterns ?? new Set();
    // The Set should contain exactly one RegExp instance.
    expect(patterns.size).toBe(1);
    const [storedPattern] = Array.from(patterns);
    expect(storedPattern.source).toBe("dup");
  });
});
