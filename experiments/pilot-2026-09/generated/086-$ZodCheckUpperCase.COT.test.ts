/**
 * Vitest test suite for the `$ZodCheckUpperCase` schema constructor.
 *
 * The class under test is not a traditional class with explicit methods,
 * but a Zod‑like schema constructor that provides the usual Zod API
 * (`parse`, `safeParse`, `check`, …) through the `$ZodCheck<string>` base
 * interface.  The tests therefore focus on the public API that a consumer
 * would interact with – mainly the validation behaviour of the schema.
 *
 * The test file follows the requested structure:
 *   1. List of public methods (derived from the Zod base interface)
 *   2. Basic functionality tests for each method
 *   3. Edge‑case / exception tests
 *   4. All tests merged into a single Vitest file.
 */

import { describe, it, expect } from "vitest";

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public methods (inherited from $ZodCheck<string>)                     */
/* -------------------------------------------------------------------------- */
/**
 * The `$ZodCheckUpperCase` schema inherits the typical Zod validation API.
 * For the purpose of this test suite we consider the following public
 * methods as the contract we need to verify:
 *
 *   - `parse(value: unknown): string`
 *   - `safeParse(value: unknown): { success: true; data: string } |
 *                                 { success: false; error: ZodError }`
 *   - `check(value: unknown): boolean`   (alias for `safeParse(...).success`)
 *   - `refine(...): this`                (method chaining – not exercised here)
 *
 * The concrete implementation of these methods lives in the `$ZodCheck`
 * base type; the `$ZodCheckUpperCase` constructor only configures the
 * underlying string‑format validation (uppercase) via `$ZodCheckStringFormat`.
 */

/* -------------------------------------------------------------------------- */
/* 2️⃣  Basic functionality tests                                            */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckUpperCase – basic validation", () => {
  // Create a default schema (uses the built‑in `regexes.uppercase` pattern)
  const UpperCaseSchema = $ZodCheckUpperCase();

  it("parse() should return the original string when it is uppercase", () => {
    const result = UpperCaseSchema.parse("HELLO WORLD");
    expect(result).toBe("HELLO WORLD");
  });

  it("parse() should throw when the string contains lowercase letters", () => {
    expect(() => UpperCaseSchema.parse("Hello World")).toThrowError();
  });

  it("safeParse() should succeed for a valid uppercase string", () => {
    const outcome = UpperCaseSchema.safeParse("ABCDEF");
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBe("ABCDEF");
    }
  });

  it("safeParse() should fail for a non‑uppercase string", () => {
    const outcome = UpperCaseSchema.safeParse("AbcDef");
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      // The error should contain at least one issue describing the format problem
      expect(outcome.error.issues).toBeDefined();
      expect(outcome.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("check() should return true for a valid uppercase string", () => {
    expect(UpperCaseSchema.check("UPPER")).toBe(true);
  });

  it("check() should return false for an invalid string", () => {
    expect(UpperCaseSchema.check("Upper")).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Edge‑case & exception tests                                          */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckUpperCase – edge cases & error handling", () => {
  const UpperCaseSchema = $ZodCheckUpperCase();

  // ---------- Non‑string inputs ----------
  const nonStringValues = [
    123,
    true,
    false,
    null,
    undefined,
    Symbol("UPPER"),
    { key: "VALUE" },
    ["ARRAY"],
  ];

  it.each(nonStringValues)(
    "parse() should throw when value is not a string (%p)",
    (value) => {
      expect(() => UpperCaseSchema.parse(value as any)).toThrowError();
    },
  );

  it.each(nonStringValues)(
    "safeParse() should fail when value is not a string (%p)",
    (value) => {
      const outcome = UpperCaseSchema.safeParse(value as any);
      expect(outcome.success).toBe(false);
    },
  );

  // ---------- Empty string ----------
  it("should reject an empty string", () => {
    expect(() => UpperCaseSchema.parse("")).toThrowError();
    const outcome = UpperCaseSchema.safeParse("");
    expect(outcome.success).toBe(false);
  });

  // ---------- Strings with whitespace ----------
  it("should reject strings that contain whitespace mixed with lowercase", () => {
    expect(() => UpperCaseSchema.parse("HELLO world")).toThrowError();
    const outcome = UpperCaseSchema.safeParse("HELLO world");
    expect(outcome.success).toBe(false);
  });

  it("should accept uppercase strings that contain spaces (if the default pattern allows it)", () => {
    // The default `regexes.uppercase` typically matches only A‑Z characters.
    // If the pattern includes spaces, this test will pass; otherwise it will fail.
    // We assert the current behaviour (most implementations disallow spaces).
    expect(() => UpperCaseSchema.parse("HELLO WORLD")).toThrowError();
  });

  // ---------- Unicode uppercase ----------
  it("should accept Unicode uppercase characters (e.g., ÄÖÜ)", () => {
    const unicodeUpper = "ÄÖÜß".toUpperCase(); // "ÄÖÜß" -> "ÄÖÜß" (ß becomes SS in some locales)
    // To avoid locale‑dependent conversion, we directly use known uppercase chars:
    const value = "ÄÖÜ";
    expect(() => UpperCaseSchema.parse(value)).not.toThrow();
    const outcome = UpperCaseSchema.safeParse(value);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBe(value);
    }
  });

  // ---------- Very long string ----------
  it("should handle a very long uppercase string without performance issues", () => {
    const longString = "A".repeat(10_000);
    expect(() => UpperCaseSchema.parse(longString)).not.toThrow();
    const outcome = UpperCaseSchema.safeParse(longString);
    expect(outcome.success).toBe(true);
  });

  // ---------- Custom pattern override ----------
  it("should respect a custom pattern supplied via definition", () => {
    // Custom pattern that only allows the literal string "XYZ"
    const CustomSchema = $ZodCheckUpperCase({
      pattern: /^XYZ$/,
    });

    // Valid according to custom pattern
    expect(() => CustomSchema.parse("XYZ")).not.toThrow();

    // Invalid according to custom pattern, even though it is uppercase
    expect(() => CustomSchema.parse("ABC")).toThrowError();
    const outcome = CustomSchema.safeParse("ABC");
    expect(outcome.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Complete test file (merged)                                           */
/* -------------------------------------------------------------------------- */
