###Test START##
```ts
/**
 * Vitest test suite for the $ZodCheckIncludes constructor.
 *
 * The tests cover:
 * 1. Public “method” extraction – the constructor itself.
 * 2. Basic functionality (pattern creation, bag registration, check logic).
 * 3. Edge‑cases and exception‑like scenarios:
 *    - empty `includes` string
 *    - `position` defined / out‑of‑range
 *    - special regex characters in `includes`
 *    - `abort` flag influencing the `continue` field of the issue.
 *
 * The $ZodCheckIncludes constructor mutates the supplied `inst` and `def`
 * objects, therefore the tests instantiate a minimal mock object that mimics
 * the shape expected by the library.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { $ZodCheckIncludes } from "./checks.js";

/**
 * Minimal mock of the internal structure used by the constructor.
 * The real library provides many more fields – we only need the ones
 * touched by the constructor for our tests.
 */
interface MockInst {
  _zod: {
    bag: Record<string, any>;
    onattach: Array<(inst: MockInst) => void>;
    check?: (payload: { value: string; issues: any[] }) => void;
  };
}

/**
 * Helper to create a fresh mock instance and definition, then run the
 * constructor and all on‑attach callbacks.
 */
function createCheck(
  def: Partial<$ZodCheckIncludesDef> & { includes: string; abort?: boolean; position?: number }
) {
  const inst: MockInst = {
    _zod: {
      bag: {},
      onattach: [],
    },
  };

  // The constructor mutates `def` (adds `pattern`) and `inst`.
  // We cast to `any` because the full type hierarchy is not needed here.
  $ZodCheckIncludes(inst as any, def as any);

  // Execute all onattach callbacks to register the pattern in the bag.
  inst._zod.onattach.forEach((cb) => cb(inst));

  return { inst: inst as any, def: def as any };
}

/**
 * PUBLIC METHOD LIST (extracted from the source)
 *
 * The class does not expose traditional methods; the only public entry point
 * is the constructor function returned by `core.$constructor`:
 *
 *   $ZodCheckIncludes(inst: $ZodCheckIncludes, def: $ZodCheckIncludesDef): void
 *
 * All behaviour is attached to the instance via the internal `_zod.check`
 * function.
 */

describe("$ZodCheckIncludes – basic behaviour", () => {
  it("creates a RegExp pattern from a simple includes string", () => {
    const { def } = createCheck({ includes: "abc" });
    expect(def.pattern).toBeInstanceOf(RegExp);
    expect(def.pattern!.source).toBe("abc"); // no escaping needed for plain text
  });

  it("escapes special regex characters in the includes string", () => {
    const { def } = createCheck({ includes: "a.*b+?" });
    // The util.escapeRegex implementation escapes . * + ? etc.
    // The escaped version should be: a\.\\*b\+\?
    // Since we cannot import the internal util, we assert that the source
    // does NOT contain raw regex meta‑characters.
    expect(def.pattern!.source).not.toMatch(/[.*+?^${}()|[\]\\]/);
    // Verify that the escaped version matches the literal string.
    expect("a.*b+?".match(def.pattern!)).not.toBeNull();
  });

  it("stores the generated pattern in the instance bag", () => {
    const { inst, def } = createCheck({ includes: "xyz" });
    const patterns: Set<RegExp> = inst._zod.bag.patterns;
    expect(patterns).toBeInstanceOf(Set);
    expect(patterns.has(def.pattern)).toBe(true);
  });

  it("passes validation when the payload includes the substring", () => {
    const { inst } = createCheck({ includes: "test" });
    const payload = { value: "this is a test string", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("fails validation when the payload does NOT include the substring", () => {
    const { inst, def } = createCheck({ includes: "missing" });
    const payload = { value: "nothing to see here", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue).toMatchObject({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: true, // default abort = false
    });
  });
});

describe("$ZodCheckIncludes – edge cases & exception‑like scenarios", () => {
  it("treats an empty includes string as always passing", () => {
    const { inst } = createCheck({ includes: "" });
    const payload = { value: "any string works", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("honors the `position` option when searching", () => {
    const { inst } = createCheck({ includes: "bc", position: 2 });
    // The substring "bc" appears at index 2 in the following string.
    const payload = { value: "aabcde", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  it("fails when `position` is out of range", () => {
    const { inst } = createCheck({ includes: "x", position: 10 });
    const payload = { value: "short", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].continue).toBe(true);
  });

  it("sets `continue` to false when `abort` flag is true", () => {
    const { inst } = createCheck({ includes: "nope", abort: true });
    const payload = { value: "does not contain", issues: [] as any[] };
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].continue).toBe(false);
  });

  it("creates a pattern that respects the `position` offset", () => {
    const { def } = createCheck({ includes: "mid", position: 5 });
    // When position is provided, the pattern is anchored with ^.{position}
    const expectedSource = `^.{5}mid`;
    expect(def.pattern!.source).toBe(expectedSource);
  });
});
```
###Test END##