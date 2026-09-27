**###Test START##**  
```ts
/**
 * Vitest test suite for the $ZodEnum implementation.
 *
 * The tests cover:
 *  - Correct handling of string, numeric and mixed enums.
 *  - Verification of the internal `values` Set.
 *  - Verification of the generated RegExp `pattern`.
 *  - Successful parsing of valid enum values.
 *  - Proper error reporting for invalid values (including non‑primitive inputs).
 *
 * The $ZodEnum constructor is imported from `./schemas.js` (relative to this test file).
 */

import { describe, it, expect } from "vitest";
import { $ZodEnum } from "./schemas.js";

/**
 * Helper to create a minimal payload object expected by the internal parse method.
 */
function makePayload<T>(value: T) {
  return {
    value,
    issues: [] as Array<{
      code: string;
      values: unknown[];
      input: unknown;
      inst: unknown;
    }>,
  };
}

/**
 * Minimal definition object required by the $ZodEnum constructor.
 * The core library only cares about the `type` and `entries` fields.
 */
function def<T extends Record<string, any>>(entries: T) {
  return {
    type: "enum" as const,
    entries,
  };
}

/* -------------------------------------------------------------------------- */
/* 1️⃣  String‑only enum                                                       */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – string enum", () => {
  const StringEnum = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
  } as const;

  const schema = $ZodEnum(def(StringEnum));

  it("exposes a Set with all enum values", () => {
    expect(schema._zod.values).toBeInstanceOf(Set);
    expect(Array.from(schema._zod.values)).toEqual(["red", "green", "blue"]);
  });

  it("creates a RegExp that matches any enum value", () => {
    const pattern = schema._zod.pattern;
    expect(pattern.test("red")).toBe(true);
    expect(pattern.test("green")).toBe(true);
    expect(pattern.test("blue")).toBe(true);
    expect(pattern.test("yellow")).toBe(false);
  });

  it("parses a valid enum value without adding issues", () => {
    const payload = makePayload("green");
    const result = schema._zod.parse(payload, {} as any);
    expect(result).toBe(payload); // same reference
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe("green");
  });

  it("adds an invalid_value issue for an unknown string", () => {
    const payload = makePayload("purple");
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe("invalid_value");
    expect(issue.values).toEqual(["red", "green", "blue"]);
    expect(issue.input).toBe("purple");
    expect(issue.inst).toBe(schema);
  });
});

/* -------------------------------------------------------------------------- */
/* 2️⃣  Numeric enum                                                          */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – numeric enum", () => {
  const NumEnum = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
  } as const;

  const schema = $ZodEnum(def(NumEnum));

  it("stores numeric values in the Set", () => {
    expect(Array.from(schema._zod.values)).toEqual([1, 2, 3]);
  });

  it("generates a RegExp that matches the stringified numbers", () => {
    const pattern = schema._zod.pattern;
    expect(pattern.test("1")).toBe(true);
    expect(pattern.test("2")).toBe(true);
    expect(pattern.test("3")).toBe(true);
    expect(pattern.test("4")).toBe(false);
    // Direct number test should be false because RegExp works on strings
    // (the internal parse uses the Set, not the RegExp, for validation)
    expect(pattern.test(1 as any)).toBe(false);
  });

  it("accepts a valid numeric payload", () => {
    const payload = makePayload(2);
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(2);
  });

  it("rejects a non‑enum number", () => {
    const payload = makePayload(99);
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe("invalid_value");
    expect(issue.values).toEqual([1, 2, 3]);
    expect(issue.input).toBe(99);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Mixed (string + number) enum                                           */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – mixed enum", () => {
  const MixedEnum = {
    YES: "yes",
    NO: "no",
    UNKNOWN: 0,
  } as const;

  const schema = $ZodEnum(def(MixedEnum));

  it("contains both string and numeric values", () => {
    const values = Array.from(schema._zod.values);
    // Order is preserved as returned by util.getEnumValues (object value order)
    expect(values).toEqual(["yes", "no", 0]);
  });

  it("pattern matches string values and numeric values as strings", () => {
    const pattern = schema._zod.pattern;
    expect(pattern.test("yes")).toBe(true);
    expect(pattern.test("no")).toBe(true);
    expect(pattern.test("0")).toBe(true); // numeric 0 stringified
    expect(pattern.test("1")).toBe(false);
  });

  it("parses a valid string enum member", () => {
    const payload = makePayload("yes");
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe("yes");
  });

  it("parses a valid numeric enum member", () => {
    const payload = makePayload(0);
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(0);
  });

  it("rejects a non‑primitive (object) payload", () => {
    const payload = makePayload({ key: "value" });
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe("invalid_value");
    expect(issue.input).toEqual({ key: "value" });
    // values array should still be the primitive enum values
    expect(issue.values).toEqual(["yes", "no", 0]);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Edge case – empty enum (should still behave gracefully)               */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – empty enum", () => {
  const EmptyEnum = {} as const;

  const schema = $ZodEnum(def(EmptyEnum));

  it("creates an empty Set and a RegExp that matches nothing", () => {
    expect(schema._zod.values.size).toBe(0);
    // The generated pattern will be `^()$` which matches only the empty string.
    // This is the most sensible fallback given the implementation.
    expect(schema._zod.pattern.test("")).toBe(true);
    expect(schema._zod.pattern.test("anything")).toBe(false);
  });

  it("always reports invalid_value for any payload", () => {
    const payload = makePayload("whatever");
    const result = schema._zod.parse(payload, {} as any);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe("invalid_value");
    expect(issue.values).toEqual([]);
    expect(issue.input).toBe("whatever");
  });
});
```
**###Test END##**