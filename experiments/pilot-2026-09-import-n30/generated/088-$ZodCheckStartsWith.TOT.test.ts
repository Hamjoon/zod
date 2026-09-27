/**
 * Vitest test suite for the `$ZodCheckStartsWith` class.
 *
 * The tests cover:
 * 1. Proper creation of the RegExp pattern (including escaping of special characters).
 * 2. Registration of the pattern in the parent schema's `bag.patterns` set via `onattach`.
 * 3. Successful validation when the payload starts with the required prefix.
 * 4. Correct issue generation when the payload does **not** start with the prefix,
 *    including handling of the `abort` flag (affects the `continue` property).
 *
 * The `$ZodCheckStartsWith` constructor is imported from `./checks.js` (relative to this file).
 * The internal shape of the returned instance is relied upon (`_zod`, `onattach`, `check`,
 * `def`, etc.) – this mirrors the public contract of the library.
 */

import { describe, it, expect } from "vitest";
import { $ZodCheckStartsWith } from "./checks.js";

/**
 * Helper to create a minimal "parent" schema that mimics the shape expected by
 * `$ZodCheckStartsWith`'s `onattach` hook.  The real library attaches the pattern
 * to `parent._zod.bag.patterns`, so we provide a simple object with that structure.
 */
function createParentSchema() {
  return {
    _zod: {
      bag: {} as Record<string, unknown>,
    },
  };
}

/**
 * Helper to build a payload object that the check function expects.
 * `issues` is an array that will be populated by the check when validation fails.
 */
function createPayload(value: string) {
  return {
    value,
    issues: [] as Array<Record<string, unknown>>,
  };
}

/* -------------------------------------------------------------------------- */
/* 1️⃣  Pattern creation & escaping                                            */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckStartsWith – pattern handling", () => {
  it("creates a RegExp that matches strings starting with the given prefix", () => {
    const def = { prefix: "hello" } as const;
    const check = new $ZodCheckStartsWith(def);

    // The constructor should store the compiled RegExp on the definition.
    expect(def).toHaveProperty("pattern");
    const pattern = (def as any).pattern as RegExp;
    expect(pattern).toBeInstanceOf(RegExp);
    expect(pattern.source).toBe("^hello.*");
  });

  it("escapes RegExp meta‑characters in the prefix", () => {
    // Prefix contains every special character that RegExp would normally treat specially.
    const specialPrefix = "a.*+?^${}()|[]\\";
    const def = { prefix: specialPrefix } as const;
    const check = new $ZodCheckStartsWith(def);

    const pattern = (def as any).pattern as RegExp;
    // The library uses `util.escapeRegex`, which escapes the characters listed above.
    const escaped = specialPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expect(pattern.source).toBe(`^${escaped}.*`);
  });
});

/* -------------------------------------------------------------------------- */
/* 2️⃣  onattach – registration of the pattern in the parent schema's bag    */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckStartsWith – onattach hook", () => {
  it("adds the compiled pattern to the parent schema's bag.patterns set", () => {
    const def = { prefix: "test" } as const;
    const check = new $ZodCheckStartsWith(def);
    const parent = createParentSchema();

    // The constructor pushes a function onto `onattach`.
    expect(Array.isArray(check._zod.onattach)).toBe(true);
    expect(check._zod.onattach).toHaveLength(1);

    // Execute the onattach hook manually (the real library does this when the check
    // is attached to a string schema).
    check._zod.onattach.forEach((fn) => fn(parent));

    // After execution, `parent._zod.bag.patterns` must be a Set containing the pattern.
    const bag = parent._zod.bag as Record<string, unknown>;
    expect(bag).toHaveProperty("patterns");
    const patterns = bag.patterns as Set<RegExp>;
    expect(patterns).toBeInstanceOf(Set);
    expect(patterns.has((def as any).pattern)).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Validation – successful case                                          */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckStartsWith – validation (success)", () => {
  it("does not push any issue when the value starts with the prefix", () => {
    const check = new $ZodCheckStartsWith({ prefix: "foo" });
    const payload = createPayload("foobar");

    // Run the check.
    check._zod.check(payload);

    // No issues should be recorded.
    expect(payload.issues).toHaveLength(0);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Validation – failure cases                                            */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckStartsWith – validation (failure)", () => {
  it("pushes an issue with correct shape when the value does not start with the prefix", () => {
    const check = new $ZodCheckStartsWith({ prefix: "bar", abort: false });
    const payload = createPayload("baz");

    check._zod.check(payload);

    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0] as Record<string, unknown>;

    // Verify every field required by the library.
    expect(issue.origin).toBe("string");
    expect(issue.code).toBe("invalid_format");
    expect(issue.format).toBe("starts_with");
    expect(issue.prefix).toBe("bar");
    expect(issue.input).toBe("baz");
    expect(issue.inst).toBe(check);
    // Because `abort` is false, `continue` must be true.
    expect(issue.continue).toBe(true);
  });

  it("sets `continue` to false when `abort` is true", () => {
    const check = new $ZodCheckStartsWith({ prefix: "x", abort: true });
    const payload = createPayload("y");

    check._zod.check(payload);

    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0] as Record<string, unknown>;
    expect(issue.continue).toBe(false);
  });
});
