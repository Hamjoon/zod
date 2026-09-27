/**
 * Vitest test suite for `ZodMiniLazy`.
 *
 * The suite covers:
 *   • Basic happy‑path behaviour of the public API
 *   • Edge‑cases and error handling specific to lazy schemas
 *
 * Adjust the import of `ZodMiniString` (or the primitive schema you prefer)
 * if your library uses a different name.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniLazy, ZodMiniString } from "./schemas.js";

/* -------------------------------------------------------------------------- */
/* Helper – a tiny string schema (the inner schema used by the lazy wrapper) */
/* -------------------------------------------------------------------------- */
function makeStringSchema() {
  // `ZodMiniString` is assumed to expose the same API as Zod's `z.string()`.
  // If the real constructor is named differently, replace this call.
  return ZodMiniString();
}

/* -------------------------------------------------------------------------- */
/* 1.  Public method “smoke” tests                                            */
/* -------------------------------------------------------------------------- */
describe("ZodMiniLazy – basic API", () => {
  const LazyString = new ZodMiniLazy(() => makeStringSchema());

  it("should parse a valid string", () => {
    expect(LazyString.parse("hello")).toBe("hello");
  });

  it("should safely parse a valid string", () => {
    const result = LazyString.safeParse("world");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("world");
    }
  });

  it("should fail parsing an invalid value", () => {
    expect(() => LazyString.parse(123 as unknown)).toThrowError();
  });

  it("should return a failed safeParse result for an invalid value", () => {
    const result = LazyString.safeParse(123 as unknown);
    expect(result.success).toBe(false);
    if (!result.success) {
      // The concrete shape of the error object depends on the library;
      // we only assert that an error object exists and contains the offending value.
      expect(result.error).toBeDefined();
      // `error.errors` is the typical Zod error array – adjust if needed.
      // @ts-ignore
      expect(result.error.errors[0].input).toBe(123);
    }
  });

  it("should become optional", () => {
    const optional = LazyString.optional();
    expect(optional.is(undefined)).toBe(true);
    expect(optional.parse(undefined)).toBe(undefined);
  });

  it("should become nullable", () => {
    const nullable = LazyString.nullable();
    expect(nullable.is(null)).toBe(true);
    expect(nullable.parse(null)).toBe(null);
  });

  it("should accept a default value", () => {
    const withDefault = LazyString.default("fallback");
    // When parsing `undefined` the default is applied
    // (Zod's default works on both `undefined` and `null` depending on version;
    // we explicitly test `undefined` here.)
    expect(withDefault.parse(undefined)).toBe("fallback");
    // Passing a valid value bypasses the default
    expect(withDefault.parse("explicit")).toBe("explicit");
  });

  it("should store a description", () => {
    const described = LazyString.describe("A lazy string schema");
    // The description is normally stored in the internal definition object.
    // Access via a private `_def` field – the exact name can differ.
    // @ts-ignore – we only use it for test purposes.
    expect(described._def?.description).toBe("A lazy string schema");
  });

  it("type‑guard `is` works for matching values", () => {
    expect(LazyString.is("test")).toBe(true);
    expect(LazyString.is(123 as unknown)).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 2.  Edge‑case tests                                                       */
/* -------------------------------------------------------------------------- */
describe("ZodMiniLazy – edge cases & error handling", () => {
  it("throws when the factory is not a function", () => {
    // @ts-ignore – intentional misuse
    expect(() => new ZodMiniLazy(123 as any)).toThrowError();
  });

  it("throws when the factory returns undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const BadLazy = new ZodMiniLazy(() => undefined as any);
    expect(() => BadLazy.parse("anything")).toThrowError();
  });

  it("throws when the factory returns a non‑schema value", () => {
    const BadLazy = new ZodMiniLazy(() => 42 as any);
    expect(() => BadLazy.parse("anything")).toThrowError();
  });

  it("propagates a synchronous error thrown by the factory", () => {
    const BadLazy = new ZodMiniLazy(() => {
      throw new Error("factory exploded");
    });
    expect(() => BadLazy.parse("test")).toThrowError("factory exploded");
  });

  it("handles recursive (circular) lazy schemas", () => {
    // A classic recursive type: a node that may contain an array of child nodes.
    type Node = { name: string; children?: Node[] };

    // The lazy definition references itself.
    const NodeSchema = new ZodMiniLazy<Node>(() => {
      return ZodMiniString()
        .transform((name) => ({ name }))
        .and(
          // Using `array().optional()` to allow recursive children
          ZodMiniLazy(() => NodeSchema).array().optional()
        );
    });

    const valid: Node = {
      name: "root",
      children: [{ name: "leaf" }],
    };

    // The actual shape depends on the concrete implementation;
    // we simply assert that parsing does **not** throw for a correctly formed value.
    expect(() => NodeSchema.parse(valid)).not.toThrow();
  });

  it("optional + nullable combination works as expected", () => {
    const schema = new ZodMiniLazy(() => makeStringSchema())
      .optional()
      .nullable();

    expect(schema.is(undefined)).toBe(true);
    expect(schema.is(null)).toBe(true);
    expect(schema.is("hello")).toBe(true);
    expect(schema.is(123 as unknown)).toBe(false);
  });

  it("default value respects the inner schema's validation", () => {
    const schema = new ZodMiniLazy(() => makeStringSchema())
      .default("default");

    // Valid – default is a string, so parsing `undefined` works.
    expect(schema.parse(undefined)).toBe("default");

    // Invalid default (e.g., a number) should raise at construction time
    // (some Zod implementations validate the default immediately).
    // We test the runtime behaviour because static validation is not possible here.
    const BadDefault = new ZodMiniLazy(() => makeStringSchema()).default(
      // @ts-ignore – intentional misuse
      123
    );
    expect(() => BadDefault.parse(undefined)).toThrowError();
  });
});

/* -------------------------------------------------------------------------- */
/* 3.  Verify that the lazy factory is executed *once* (caching behaviour)   */
/* -------------------------------------------------------------------------- */
describe("ZodMiniLazy – factory execution", () => {
  it("should call the factory only on first use (caching)", () => {
    let callCount = 0;
    const Lazy = new ZodMiniLazy(() => {
      callCount += 1;
      return makeStringSchema();
    });

    // First parse triggers the factory
    Lazy.parse("first");
    expect(callCount).toBe(1);

    // Subsequent parses reuse the already created inner schema
    Lazy.parse("second");
    Lazy.safeParse("third");
    expect(callCount).toBe(1);
  });
});
