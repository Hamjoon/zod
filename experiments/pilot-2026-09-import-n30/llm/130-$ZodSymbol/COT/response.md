###Test START##
```ts
/**
 * Vitest test suite for the $ZodSymbol class.
 *
 * The $ZodSymbol schema validates that a given value is a JavaScript `symbol`.
 * Internally it uses a `_zod.parse` method that receives a `payload` object
 * with the shape `{ value: any; issues: $ZodIssue[] }` and pushes an issue
 * when the value is not a symbol.
 *
 * The tests below cover:
 *   1. Public API – creating an instance via the exported constructor.
 *   2. Basic functionality – successful validation of symbols.
 *   3. Failure cases – non‑symbol values produce a correctly‑shaped issue.
 *   4. Edge‑case handling – Symbol objects, Symbol.for, Symbol.iterator, etc.
 *
 * The test file follows the required format: it starts with `###Test START##`
 * and ends with `###Test END##`.
 */

import { describe, it, expect } from "vitest";
import { $ZodSymbol } from "./schemas.js";

/**
 * Helper to build the payload object expected by the internal `_zod.parse`
 * implementation.  The payload mimics the shape used inside the Zod core:
 *
 *   {
 *     value: any;          // the value being validated
 *     issues: $ZodIssue[]; // collection of validation issues (empty initially)
 *   }
 */
function makePayload(value: any) {
  return {
    value,
    issues: [] as Array<{
      expected: string;
      code: string;
      input: any;
      inst: unknown;
    }>,
  };
}

describe("$ZodSymbol – public constructor", () => {
  it("should be a callable constructor that returns a schema instance", () => {
    const schema = $ZodSymbol(); // no arguments required
    // The returned object should expose the internal `_zod` property
    expect(schema).toBeTypeOf("object");
    expect(schema).toHaveProperty("_zod");
    // The internal `_zod` should contain a `parse` function
    expect(schema._zod.parse).toBeTypeOf("function");
  });
});

describe("$ZodSymbol – successful validation", () => {
  const schema = $ZodSymbol();

  it("accepts a primitive Symbol without adding issues", () => {
    const sym = Symbol("test");
    const payload = makePayload(sym);
    const result = schema._zod.parse(payload, undefined as any);
    expect(result).toBe(payload); // same object is returned
    expect(result.issues).toHaveLength(0);
  });

  it("accepts Symbol.for values", () => {
    const sym = Symbol.for("global");
    const payload = makePayload(sym);
    const result = schema._zod.parse(payload, undefined as any);
    expect(result.issues).toHaveLength(0);
  });

  it("accepts built‑in well‑known symbols (e.g., Symbol.iterator)", () => {
    const sym = Symbol.iterator;
    const payload = makePayload(sym);
    const result = schema._zod.parse(payload, undefined as any);
    expect(result.issues).toHaveLength(0);
  });
});

describe("$ZodSymbol – failure handling & edge cases", () => {
  const schema = $ZodSymbol();

  /**
   * Utility to assert that a non‑symbol value produces exactly one issue
   * with the expected shape.
   */
  function expectInvalidTypeIssue(value: any) {
    const payload = makePayload(value);
    const result = schema._zod.parse(payload, undefined as any);
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue).toMatchObject({
      expected: "symbol",
      code: "invalid_type",
      input: value,
    });
    // The `inst` property should reference the schema instance itself
    expect(issue.inst).toBe(schema);
  }

  it("rejects a number", () => {
    expectInvalidTypeIssue(42);
  });

  it("rejects a string", () => {
    expectInvalidTypeIssue("not a symbol");
  });

  it("rejects a boolean", () => {
    expectInvalidTypeIssue(true);
  });

  it("rejects null and undefined", () => {
    expectInvalidTypeIssue(null);
    expectInvalidTypeIssue(undefined);
  });

  it("rejects an object", () => {
    expectInvalidTypeIssue({ foo: "bar" });
  });

  it("rejects an array", () => {
    expectInvalidTypeIssue([1, 2, 3]);
  });

  it("rejects a function", () => {
    expectInvalidTypeIssue(() => {});
  });

  it("rejects a Symbol wrapper object (Object(Symbol()))", () => {
    const wrapper = Object(Symbol("wrapped"));
    expectInvalidTypeIssue(wrapper);
  });

  it("rejects a Date instance", () => {
    expectInvalidTypeIssue(new Date());
  });
});
```
###Test END##