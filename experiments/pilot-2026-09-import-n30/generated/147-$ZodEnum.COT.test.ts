/**
 * Vitest test suite for the `$ZodEnum` class.
 *
 * The tests cover:
 * 1. Public API surface (inherited from `$ZodType`): `parse`, `safeParse`, `check`, `isValid`.
 * 2. Normal behaviour with string, numeric and mixed enums.
 * 3. Edge‑cases such as duplicate enum values, empty enums, and non‑primitive enum members.
 * 4. Internal helpers (`_zod.values` Set and `_zod.pattern` RegExp) via public methods.
 *
 * The `$ZodEnum` constructor is imported from `./schemas.js`.
 */

import { describe, it, expect } from "vitest";
import { $ZodEnum } from "./schemas.js";

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public methods (inherited from $ZodType)                               */
/* -------------------------------------------------------------------------- */
/**
 * The `$ZodEnum` type extends `$ZodType`, therefore the following public
 * methods are available on every instance:
 *
 * - `parse(value: unknown): T` – throws on validation error.
 * - `safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }`
 * - `check(value: unknown): boolean` – returns `true` if the value is valid.
 * - `isValid(value: unknown): boolean` – alias for `check`.
 *
 * The concrete signatures are taken from the Zod typings, but for the purpose
 * of this test suite we only need to know that they exist and behave as
 * described above.
 */

/* -------------------------------------------------------------------------- */
/* 2️⃣  Helper enums used throughout the test suite                            */
/* -------------------------------------------------------------------------- */
enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
}

enum Status {
  Ok = 0,
  Fail = 1,
  // duplicate value (both `Pending` and `Waiting` resolve to 2)
  Pending = 2,
  Waiting = 2,
}

/**
 * Mixed enum – string keys with numeric values and vice‑versa.
 * TypeScript treats this as a *heterogeneous* enum.
 */
enum Mixed {
  Yes = "yes",
  No = 0,
}

/**
 * Empty enum – TypeScript does not allow a completely empty enum, but we can
 * simulate the edge case by passing an object that looks like an enum with no
 * own properties.
 */
const EmptyEnum = {} as const;

/* -------------------------------------------------------------------------- */
/* 3️⃣  Basic functionality tests                                              */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – basic functionality", () => {
  it("parses valid string enum values", () => {
    const schema = $ZodEnum({ entries: Color });
    expect(schema.parse("red")).toBe("red");
    expect(schema.parse(Color.Blue)).toBe("blue");
  });

  it("fails parsing invalid string enum values", () => {
    const schema = $ZodEnum({ entries: Color });
    expect(() => schema.parse("purple")).toThrowError(/invalid_value/);
  });

  it("parses valid numeric enum values", () => {
    const schema = $ZodEnum({ entries: Status });
    expect(schema.parse(0)).toBe(0);
    expect(schema.parse(Status.Fail)).toBe(1);
    // duplicate values should still be accepted
    expect(schema.parse(Status.Pending)).toBe(2);
    expect(schema.parse(Status.Waiting)).toBe(2);
  });

  it("fails parsing invalid numeric enum values", () => {
    const schema = $ZodEnum({ entries: Status });
    expect(() => schema.parse(3)).toThrowError(/invalid_value/);
  });

  it("parses mixed enum values (string & number)", () => {
    const schema = $ZodEnum({ entries: Mixed });
    expect(schema.parse("yes")).toBe("yes");
    expect(schema.parse(0)).toBe(0);
  });

  it("safeParse returns success for valid values", () => {
    const schema = $ZodEnum({ entries: Color });
    const result = schema.safeParse("green");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("green");
    }
  });

  it("safeParse returns failure for invalid values", () => {
    const schema = $ZodEnum({ entries: Color });
    const result = schema.safeParse("orange");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe("invalid_value");
    }
  });

  it("check / isValid return true for valid values and false otherwise", () => {
    const schema = $ZodEnum({ entries: Status });
    expect(schema.check(1)).toBe(true);
    expect(schema.isValid(Status.Ok)).toBe(true);
    expect(schema.check(99)).toBe(false);
    expect(schema.isValid("not-an-enum")).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Internal state verification (values Set & pattern RegExp)              */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – internal helpers", () => {
  it("exposes a Set of allowed values via the internal `_zod.values`", () => {
    const schema = $ZodEnum({ entries: Color });
    // @ts-expect-error – `_zod` is an internal property, but we can inspect it in tests.
    const valuesSet = schema._zod.values as Set<unknown>;
    expect(valuesSet.size).toBe(3);
    expect(valuesSet.has("red")).toBe(true);
    expect(valuesSet.has("blue")).toBe(true);
    expect(valuesSet.has("green")).toBe(true);
  });

  it("creates a RegExp pattern that matches only the enum values (string case)", () => {
    const schema = $ZodEnum({ entries: Color });
    // @ts-expect-error – internal property.
    const pattern = schema._zod.pattern as RegExp;
    expect(pattern.test("red")).toBe(true);
    expect(pattern.test("blue")).toBe(true);
    expect(pattern.test("green")).toBe(true);
    expect(pattern.test("yellow")).toBe(false);
    // numeric strings should not match a pure‑string enum
    expect(pattern.test("0")).toBe(false);
  });

  it("creates a RegExp pattern that matches numeric enum values when they are numbers", () => {
    const schema = $ZodEnum({ entries: Status });
    // @ts-expect-error – internal property.
    const pattern = schema._zod.pattern as RegExp;
    // The pattern is built from the primitive values, numbers are converted to strings.
    expect(pattern.test("0")).toBe(true);
    expect(pattern.test("1")).toBe(true);
    expect(pattern.test("2")).toBe(true);
    expect(pattern.test("3")).toBe(false);
  });

  it("deduplicates duplicate enum values in the internal Set and RegExp", () => {
    const schema = $ZodEnum({ entries: Status });
    // @ts-expect-error – internal property.
    const valuesSet = schema._zod.values as Set<unknown>;
    // Even though `Pending` and `Waiting` both map to `2`, the Set should contain it only once.
    expect(valuesSet.size).toBe(3);
    expect(valuesSet.has(2)).toBe(true);
    // @ts-expect-error – internal property.
    const pattern = schema._zod.pattern as RegExp;
    // The pattern should contain `2` only once.
    const matches = pattern.source.match(/\b2\b/g) ?? [];
    expect(matches.length).toBe(1);
  });
});

/* -------------------------------------------------------------------------- */
/* 5️⃣  Edge‑case & exception handling                                         */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – edge cases & error handling", () => {
  it("throws a clear error when parsing `undefined`", () => {
    const schema = $ZodEnum({ entries: Color });
    expect(() => schema.parse(undefined)).toThrowError(/invalid_value/);
  });

  it("throws a clear error when parsing `null`", () => {
    const schema = $ZodEnum({ entries: Color });
    expect(() => schema.parse(null)).toThrowError(/invalid_value/);
  });

  it("throws a clear error when parsing an object", () => {
    const schema = $ZodEnum({ entries: Color });
    expect(() => schema.parse({})).toThrowError(/invalid_value/);
  });

  it("handles an enum with no members (empty object) gracefully", () => {
    const schema = $ZodEnum({ entries: EmptyEnum });
    // @ts-expect-error – internal property.
    const valuesSet = schema._zod.values as Set<unknown>;
    expect(valuesSet.size).toBe(0);
    // @ts-expect-error – internal property.
    const pattern = schema._zod.pattern as RegExp;
    // The pattern should match nothing (empty alternation) – it will be `^()$`
    expect(pattern.test("anything")).toBe(false);
    // Parsing any value must fail.
    expect(() => schema.parse("whatever")).toThrowError(/invalid_value/);
  });

  it("ignores non‑primitive enum members when building the Set/RegExp", () => {
    // Simulate a “bad” enum where a value is an object (not allowed by Zod).
    const BadEnum = {
      Foo: { a: 1 },
      Bar: "bar",
    } as const;
    const schema = $ZodEnum({ entries: BadEnum });
    // @ts-expect-error – internal property.
    const valuesSet = schema._zod.values as Set<unknown>;
    // Only the primitive value should be present.
    expect(valuesSet.size).toBe(1);
    expect(valuesSet.has("bar")).toBe(true);
    // The RegExp should only contain the string literal.
    // @ts-expect-error – internal property.
    const pattern = schema._zod.pattern as RegExp;
    expect(pattern.test("bar")).toBe(true);
    expect(pattern.test("[object Object]")).toBe(false);
    // Parsing the object must fail.
    expect(() => schema.parse({ a: 1 })).toThrowError(/invalid_value/);
  });
});

/* -------------------------------------------------------------------------- */
/* 6️⃣  Summary – ensure the exported constructor works as a function          */
/* -------------------------------------------------------------------------- */
describe("$ZodEnum – constructor contract", () => {
  it("is a callable constructor that returns a Zod schema", () => {
    const schema = $ZodEnum({ entries: Color });
    // The returned object should have the typical Zod methods.
    expect(typeof schema.parse).toBe("function");
    expect(typeof schema.safeParse).toBe("function");
    expect(typeof schema.check).toBe("function");
    expect(typeof schema.isValid).toBe("function");
  });
});
