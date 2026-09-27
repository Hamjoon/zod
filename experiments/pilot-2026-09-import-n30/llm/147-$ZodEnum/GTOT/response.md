**$ZodEnum.test.ts**

```ts
###Test START##
import { describe, it, expect } from "vitest";
import { $ZodEnum } from "./schemas.js";

/**
 * Helper to build the payload object expected by the internal parse implementation.
 * The payload mimics the shape used inside the library:
 *   { value: <input>, issues: [] }
 */
function makePayload<T>(value: T) {
  return { value, issues: [] as any[] };
}

/**
 * Utility to extract the internal `parse` function from a $ZodEnum instance.
 * The public API of the library is not fully exposed in the snippet, so we
 * directly access the internal implementation for testing purposes.
 */
function getInternalParse<T>(schema: any) {
  return schema._zod.parse as (payload: any, ctx?: any) => any;
}

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public method extraction (the only public‑ish method we can test here) */
/* -------------------------------------------------------------------------- */

type PublicMethod = {
  name: string;
  signature: string;
};

const publicMethods: PublicMethod[] = [
  {
    name: "parse",
    // The internal parse signature (payload, _ctx?) => payload
    signature:
      "(payload: { value: any; issues: any[] }, _ctx?: any) => { value: any; issues: any[] }",
  },
];

/* -------------------------------------------------------------------------- */
/* 2️⃣  Basic functionality tests                                            */
/* -------------------------------------------------------------------------- */

describe("$ZodEnum – basic functionality", () => {
  it("should accept a valid string enum value", () => {
    const MyEnum = { A: "a", B: "b" } as const;
    const schema = $ZodEnum({ entries: MyEnum });

    const parse = getInternalParse(schema);
    const payload = makePayload("a");
    const result = parse(payload, undefined);

    // No issues should be added and the payload should be returned unchanged
    expect(result).toBe(payload);
    expect(result.issues).toHaveLength(0);
  });

  it("should reject an invalid string enum value", () => {
    const MyEnum = { A: "a", B: "b" } as const;
    const schema = $ZodEnum({ entries: MyEnum });

    const parse = getInternalParse(schema);
    const payload = makePayload("c");
    const result = parse(payload, undefined);

    expect(result).toBe(payload);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe("invalid_value");
    expect(issue.values).toEqual(["a", "b"]);
    expect(issue.input).toBe("c");
    expect(issue.inst).toBe(schema);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Edge‑case & exception tests                                          */
/* -------------------------------------------------------------------------- */

describe("$ZodEnum – edge cases & error handling", () => {
  it("should handle numeric enum values correctly", () => {
    const NumEnum = { ONE: 1, TWO: 2 } as const;
    const schema = $ZodEnum({ entries: NumEnum });

    const parse = getInternalParse(schema);

    // Valid numeric value
    const okPayload = makePayload(1);
    const okResult = parse(okPayload, undefined);
    expect(okResult.issues).toHaveLength(0);

    // Invalid numeric value
    const badPayload = makePayload(3);
    const badResult = parse(badPayload, undefined);
    expect(badResult.issues).toHaveLength(1);
    expect(badResult.issues[0].values).toEqual([1, 2]);
  });

  it("should correctly escape regex‑special characters in string enum values", () => {
    const SpecialEnum = { PLUS: "a+b", STAR: "c*d", DOT: "e.f" } as const;
    const schema = $ZodEnum({ entries: SpecialEnum });

    // The internal RegExp should match the literal strings, not treat them as patterns
    const pattern: RegExp = schema._zod.pattern;
    expect(pattern.test("a+b")).toBe(true);
    expect(pattern.test("c*d")).toBe(true);
    expect(pattern.test("e.f")).toBe(true);
    // Ensure a similar but non‑exact string does NOT match
    expect(pattern.test("ab")).toBe(false);
    expect(pattern.test("c d")).toBe(false);
  });

  it("should treat duplicate enum values as a single entry", () => {
    // TypeScript allows duplicate values in enums
    const DupEnum = { A: "x", B: "x", C: "y" } as const;
    const schema = $ZodEnum({ entries: DupEnum });

    // The Set should deduplicate the duplicate "x"
    expect(Array.from(schema._zod.values)).toEqual(["x", "y"]);

    const parse = getInternalParse(schema);
    const payload = makePayload("x");
    const result = parse(payload, undefined);
    expect(result.issues).toHaveLength(0);
  });

  it("should reject any value when the enum is empty", () => {
    const EmptyEnum = {} as const;
    const schema = $ZodEnum({ entries: EmptyEnum });

    // Values set should be empty
    expect(schema._zod.values.size).toBe(0);
    // The generated pattern will be ^()$ which matches nothing
    expect(schema._zod.pattern.test("anything")).toBe(false);

    const parse = getInternalParse(schema);
    const payload = makePayload("whatever");
    const result = parse(payload, undefined);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].values).toEqual([]);
  });

  it("should correctly handle non‑primitive enum values (they are ignored in the pattern)", () => {
    // Objects are not primitive; they should be excluded from the RegExp pattern
    const MixedEnum = { OBJ: { a: 1 }, NUM: 42, STR: "hello" } as const;
    const schema = $ZodEnum({ entries: MixedEnum });

    // The pattern should only contain the primitive entries (42 and "hello")
    const pattern: RegExp = schema._zod.pattern;
    expect(pattern.test("hello")).toBe(true);
    expect(pattern.test("42")).toBe(true); // because numbers are converted to string
    expect(pattern.test("[object Object]")).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Exported method list verification (optional sanity check)          */
/* -------------------------------------------------------------------------- */

describe("$ZodEnum – public method list sanity check", () => {
  it("should expose the expected public methods", () => {
    const DummyEnum = { X: "x" } as const;
    const schema = $ZodEnum({ entries: DummyEnum });

    // Verify that the method we rely on exists
    expect(typeof schema._zod.parse).toBe("function");
    // No other public methods are defined in the provided snippet
    const methodNames = publicMethods.map((m) => m.name);
    expect(Object.keys(schema)).toContain("_zod");
    // The test is mainly illustrative; real libraries expose many more helpers.
  });
});
###Test END##
```