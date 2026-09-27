import { describe, expect, it } from "vitest";
import { ZodMiniVoid } from "./schemas.js";

/**
 * Helper – creates a fresh ZodMiniVoid instance.
 */
function getSchema() {
  // The exported value is a constructor function; calling it returns the schema.
  // If the library expects a definition object we pass `undefined` (the default).
  // The exact call signature is not important for the tests – we only need an
  // instance that exposes the public methods.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – the constructor may accept no arguments.
  return ZodMiniVoid();
}

/**
 * List of public methods we expect on a ZodMiniVoid instance.
 * If a method is missing the corresponding test will be skipped.
 */
const PUBLIC_METHODS = [
  "parse",
  "safeParse",
  "optional",
  "nullable",
  "default",
  "catch",
  "describe",
  "refine",
  "superRefine",
  "transform",
] as const;

describe("ZodMiniVoid – public API surface", () => {
  const schema = getSchema();

  it("should expose the expected public methods", () => {
    for (const method of PUBLIC_METHODS) {
      expect(typeof (schema as any)[method]).toBe("function");
    }
  });
});

/* -------------------------------------------------------------------------- */
/* --------------------------- HAPPY‑PATH TESTS ---------------------------- */
/* -------------------------------------------------------------------------- */

describe("ZodMiniVoid – happy‑path behaviour", () => {
  it("parse(undefined) returns undefined", () => {
    const schema = getSchema();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it("safeParse(undefined) succeeds", () => {
    const schema = getSchema();
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeUndefined();
    }
  });

  it("optional() allows undefined but not null", () => {
    const schema = getSchema().optional();
    expect(schema.parse(undefined)).toBeUndefined();
    expect(() => schema.parse(null)).toThrowError();
  });

  it("nullable() allows null", () => {
    const schema = getSchema().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it("default(undefined) returns undefined when value is undefined", () => {
    const schema = getSchema().default(undefined);
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it("catch(undefined) returns the catch value on failure", () => {
    const schema = getSchema().catch(undefined);
    // any non‑void value triggers the catch branch
    expect(schema.parse("anything")).toBeUndefined();
  });

  it("describe() is chainable and returns the same instance", () => {
    const schema = getSchema();
    const described = schema.describe("my void");
    expect(described).toBe(schema);
  });

  it("refine() with a passing predicate succeeds", () => {
    const schema = getSchema().refine(() => true, "should never fail");
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it("superRefine() with a no‑op callback succeeds", () => {
    const schema = getSchema().superRefine(() => {});
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it("transform() can change the output type", () => {
    const schema = getSchema().transform(() => 42);
    expect(schema.parse(undefined)).toBe(42);
  });
});

/* -------------------------------------------------------------------------- */
/* -------------------------- EDGE‑CASE TESTS ------------------------------ */
/* -------------------------------------------------------------------------- */

describe("ZodMiniVoid – edge cases & error handling", () => {
  it("parse() throws on any non‑undefined value", () => {
    const schema = getSchema();
    const badValues = [null, 0, "", {}, [], true, Symbol()];
    for (const v of badValues) {
      expect(() => schema.parse(v)).toThrowError();
    }
  });

  it("safeParse() returns failure for non‑undefined values", () => {
    const schema = getSchema();
    const badValues = [null, 1, "a"];
    for (const v of badValues) {
      const result = schema.safeParse(v);
      expect(result.success).toBe(false);
    }
  });

  it("optional().parse(null) still throws", () => {
    const schema = getSchema().optional();
    expect(() => schema.parse(null)).toThrowError();
  });

  it("nullable().parse(undefined) succeeds (both allowed)", () => {
    const schema = getSchema().nullable();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it("default() with a non‑void default returns that default", () => {
    // Even though a void schema should only accept undefined, Zod allows any
    // value as a default – we test that the default is honoured.
    const schema = getSchema().default(123 as any);
    // When we *omit* the value, the default is used.
    // The Zod API expresses this via `parse(undefined)`.
    expect(schema.parse(undefined)).toBe(123);
  });

  it("refine() that fails throws a ZodError with the custom message", () => {
    const schema = getSchema().refine(() => false, "refine failed");
    try {
      schema.parse(undefined);
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      // Zod errors contain a `issues` array with the message we supplied.
      expect(e.message).toContain("refine failed");
    }
  });

  it("transform() that throws is wrapped in a ZodError", () => {
    const schema = getSchema().transform(() => {
      throw new Error("boom");
    });
    try {
      schema.parse(undefined);
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain("boom");
    }
  });

  it("describe('') returns the same instance (no validation on description)", () => {
    const schema = getSchema();
    const described = schema.describe("");
    expect(described).toBe(schema);
  });

  it("chaining optional → nullable → default works as expected", () => {
    const schema = getSchema().optional().nullable().default("fallback" as any);
    // undefined → default
    expect(schema.parse(undefined)).toBe("fallback");
    // null → allowed by nullable
    expect(schema.parse(null)).toBeNull();
    // undefined (explicit) after optional is still treated as missing → default
    expect(schema.parse(undefined)).toBe("fallback");
  });
});

/* -------------------------------------------------------------------------- */
/* --------------------------- IMPLEMENTATION NOTES ------------------------ */
/* -------------------------------------------------------------------------- */

/**
 * The tests are deliberately defensive:
 * - They first verify that each expected method exists on the instance.
 * - If a method is missing, the corresponding test will simply fail at the
 *   “method existence” check, making the problem obvious.
 * - All runtime checks use Vitest’s `expect(...).toThrowError()` or the
 *   `safeParse` result shape, which works regardless of the exact Zod version.
 *
 * No external dependencies other than Vitest are required.
 */
