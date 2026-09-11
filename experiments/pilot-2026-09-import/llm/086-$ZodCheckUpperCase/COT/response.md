**###Test START##**  
```ts
/**
 * Vitest test suite for the `$ZodCheckUpperCase` validator.
 *
 * The `$ZodCheckUpperCase` export is a *constructor* created by `core.$constructor`.
 * Instances of this constructor behave like Zod string checks – they expose the
 * standard Zod API (`parse`, `safeParse`, etc.) and keep internal metadata in the
 * `_zod` property.
 *
 * The tests below cover:
 *   1. Public API surface (the methods we can reliably call on an instance).
 *   2. Normal behaviour – accepting only fully‑uppercase strings.
 *   3. Edge‑case handling (empty strings, non‑string values, Unicode, whitespace,
 *      custom pattern overrides, etc.).
 *   4. Proper error throwing / issue reporting for invalid inputs.
 *
 * The test file follows the exact format requested:
 *   - Starts with `###Test START##`
 *   - Ends with `###Test END##`
 */

import { describe, it, expect } from "vitest";
import { $ZodCheckUpperCase } from "./checks.js";

/* -------------------------------------------------------------------------- */
/* 1️⃣  PUBLIC METHODS & SIGNATURES                                            */
/* -------------------------------------------------------------------------- */

/**
 * The `$ZodCheckUpperCase` constructor returns an object that implements the
 * `$ZodCheck<string>` interface.  From the Zod family we can safely assume the
 * following public methods exist on every check instance:
 *
 *   - `parse(value: unknown): string`
 *   - `safeParse(value: unknown): { success: true; data: string } | { success: false; error: ZodError }`
 *   - `refine(...): this`               // chainable, not exercised directly here
 *   - `optional(): this`                // returns a new schema that also accepts `undefined`
 *
 * The test suite only uses `parse` and `safeParse` because they are the most
 * straightforward ways to verify validation behaviour.
 */

/* -------------------------------------------------------------------------- */
/* 2️⃣  BASIC FUNCTIONALITY TESTS                                              */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckUpperCase – basic validation", () => {
  // Create a default instance (no custom definition supplied)
  const UpperCaseSchema = $ZodCheckUpperCase();

  it("should expose the expected public methods", () => {
    expect(typeof UpperCaseSchema.parse).toBe("function");
    expect(typeof UpperCaseSchema.safeParse).toBe("function");
    // `_zod` is the internal metadata holder – it should exist but be treated as private
    expect(UpperCaseSchema).toHaveProperty("_zod");
  });

  it("accepts a fully uppercase ASCII string", () => {
    const input = "HELLO WORLD";
    expect(UpperCaseSchema.parse(input)).toBe(input);
  });

  it("rejects a mixed‑case ASCII string", () => {
    const input = "Hello World";
    expect(() => UpperCaseSchema.parse(input)).toThrowError();
  });

  it("rejects a fully lowercase ASCII string", () => {
    const input = "lowercase";
    expect(() => UpperCaseSchema.parse(input)).toThrowError();
  });

  it("accepts an empty string (empty string matches the uppercase regex)", () => {
    // The default `regexes.uppercase` is `/^[A-Z]*$/` – it allows zero characters.
    const input = "";
    expect(UpperCaseSchema.parse(input)).toBe(input);
  });

  it("rejects non‑string values (number, boolean, object, null, undefined)", () => {
    const badValues = [123, true, {}, null, undefined];
    for (const val of badValues) {
      expect(() => UpperCaseSchema.parse(val as any)).toThrowError();
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  EDGE‑CASE & EXCEPTION TESTS                                            */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckUpperCase – edge cases & custom pattern handling", () => {
  /**
   * Helper to extract the internal regex pattern used by the validator.
   * The internal shape is defined by `$ZodCheckUpperCaseInternals`:
   *   {
   *     def: { pattern?: RegExp; ... },
   *     issc: errors.$ZodIssueInvalidStringFormat,
   *   }
   */
  const getInternalPattern = (schema: any): RegExp | undefined => schema._zod?.def?.pattern;

  it("uses the default uppercase regex when no custom pattern is supplied", () => {
    const schema = $ZodCheckUpperCase();
    const pattern = getInternalPattern(schema);
    // The default pattern is `regexes.uppercase` which matches only A‑Z characters.
    expect(pattern).toBeInstanceOf(RegExp);
    // Quick sanity check – the pattern should reject a lowercase letter.
    expect(pattern?.test("a")).toBe(false);
    // And accept an uppercase letter.
    expect(pattern?.test("Z")).toBe(true);
  });

  it("allows a custom pattern to override the default", () => {
    // Custom pattern that *only* allows the literal string "CUSTOM"
    const customPattern = /^CUSTOM$/;
    const schema = $ZodCheckUpperCase({ pattern: customPattern });

    // Internal pattern should be the one we passed
    expect(getInternalPattern(schema)).toBe(customPattern);

    // Validation now follows the custom rule
    expect(() => schema.parse("CUSTOM")).not.toThrow();
    expect(() => schema.parse("CUSTOMX")).toThrowError();
    expect(() => schema.parse("custom")).toThrowError();
  });

  it("correctly validates Unicode uppercase characters", () => {
    const schema = $ZodCheckUpperCase();

    // Example Unicode uppercase letters (Greek, Cyrillic, accented Latin)
    const unicodeUpper = "ÄÖÜΓΔЖ";
    expect(schema.parse(unicodeUpper)).toBe(unicodeUpper);
  });

  it("rejects strings that contain whitespace characters other than space", () => {
    const schema = $ZodCheckUpperCase();

    // Tab and newline are not matched by the default ASCII‑only pattern.
    const bad = "HELLO\tWORLD\n";
    expect(() => schema.parse(bad)).toThrowError();
  });

  it("safeParse returns a success result for valid input", () => {
    const schema = $ZodCheckUpperCase();
    const result = schema.safeParse("VALID");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("VALID");
    }
  });

  it("safeParse returns a failure result with proper error shape for invalid input", () => {
    const schema = $ZodCheckUpperCase();
    const result = schema.safeParse("Invalid");
    expect(result.success).toBe(false);
    if (!result.success) {
      // ZodError contains an `issues` array – we check that at least one issue exists.
      expect(Array.isArray(result.error.issues)).toBe(true);
      expect(result.error.issues.length).toBeGreaterThan(0);
      // The first issue should be of type `$ZodIssueInvalidStringFormat`
      const firstIssue = result.error.issues[0];
      expect(firstIssue.code).toBe("invalid_string");
      // The `validation` property should indicate the format that failed.
      expect(firstIssue.validation?.toLowerCase()).toContain("uppercase");
    }
  });

  it("optional() creates a schema that also accepts undefined", () => {
    const schema = $ZodCheckUpperCase().optional();

    // `undefined` should be allowed without throwing.
    expect(() => schema.parse(undefined)).not.toThrow();

    // Still validates uppercase strings.
    expect(() => schema.parse("OK")).not.toThrow();

    // Still rejects non‑uppercase strings.
    expect(() => schema.parse("No")).toThrowError();
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  SUMMARY                                                               */
/* -------------------------------------------------------------------------- */

describe("$ZodCheckUpperCase – overall contract", () => {
  it("behaves like a typical Zod string schema with an uppercase format constraint", () => {
    const schema = $ZodCheckUpperCase();

    // Valid cases
    const valid = ["A", "ABC", "XYZ", "ÄÖÜ", ""];
    for (const v of valid) {
      expect(schema.safeParse(v).success).toBe(true);
    }

    // Invalid cases
    const invalid = ["a", "Abc", "123", "hello world", "HELLO\n", null, 42];
    for (const v of invalid) {
      expect(schema.safeParse(v as any).success).toBe(false);
    }
  });
});
```
**###Test END##**