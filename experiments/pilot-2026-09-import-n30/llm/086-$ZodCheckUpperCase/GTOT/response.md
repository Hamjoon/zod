###Test START##
```ts
/**
 * Vitest test suite for the `$ZodCheckUpperCase` Zod‑like schema.
 *
 * The class is exported from `./checks.js`.  It is a Zod constructor that
 * validates that a string consists only of upper‑case characters (according
 * to the internal `regexes.uppercase` pattern).  The schema therefore provides
 * the standard Zod public API (`parse`, `safeParse`, `check`, …) inherited
 * from `$ZodCheckStringFormat`.
 *
 * The test file follows the collaborative steps described in the prompt:
 * 1. List public methods (derived from the Zod base class).
 * 2. Provide a basic test for each method.
 * 3. Identify edge‑cases and exception scenarios.
 * 4. Add dedicated tests for those edge‑cases.
 * 5. Merge everything into a single, runnable Vitest file.
 */

import { describe, it, expect } from "vitest";
import { $ZodCheckUpperCase } from "./checks.js";
import type { $ZodCheckUpperCase as UpperCaseSchema } from "./checks.js";
import { errors } from "./errors.js"; // adjust path if needed

/* -------------------------------------------------------------------------- */
/* 1️⃣ Public methods (inherited from the Zod base class)                     */
/* -------------------------------------------------------------------------- */
/*
  The `$ZodCheckUpperCase` schema extends `$ZodCheck<string>` which, like any
  Zod schema, exposes the following public methods that are relevant for testing:

  - parse(value: unknown): string
  - safeParse(value: unknown): { success: true; data: string } |
                                 { success: false; error: ZodError }
  - check(value: unknown): boolean          // alias for safeParse().success
  - refine(...): this                        // chainable, not exercised here
  - optional(): ZodOptional<string>
  - nullable(): ZodNullable<string>
  - array(): ZodArray<string>
  - etc.

  For the purpose of this test suite we focus on the core validation methods:
  `parse`, `safeParse`, and `check`.
*/

/* -------------------------------------------------------------------------- */
/* 2️⃣ Basic functionality tests                                            */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckUpperCase – basic validation", () => {
  const UpperCase = $ZodCheckUpperCase as unknown as (() => UpperCaseSchema);

  it("should expose the expected public methods", () => {
    const schema = UpperCase();
    expect(typeof schema.parse).toBe("function");
    expect(typeof schema.safeParse).toBe("function");
    expect(typeof schema.check).toBe("function");
  });

  it("parse() accepts a valid all‑uppercase string", () => {
    const schema = UpperCase();
    const input = "HELLO WORLD";
    expect(() => schema.parse(input)).not.toThrow();
    expect(schema.parse(input)).toBe(input);
  });

  it("parse() rejects a lower‑case string", () => {
    const schema = UpperCase();
    const input = "hello world";
    expect(() => schema.parse(input)).toThrow();
  });

  it("safeParse() returns success for a valid uppercase string", () => {
    const schema = UpperCase();
    const result = schema.safeParse("VITEST");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("VITEST");
    }
  });

  it("safeParse() returns failure for an invalid string", () => {
    const schema = UpperCase();
    const result = schema.safeParse("ViTeSt");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it("check() returns true for a valid uppercase string", () => {
    const schema = UpperCase();
    expect(schema.check("UPPER")).toBe(true);
  });

  it("check() returns false for an invalid string", () => {
    const schema = UpperCase();
    expect(schema.check("Upper")).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣ Edge‑case & exception identification                                 */
/* -------------------------------------------------------------------------- */
/*
  Potential edge‑cases for an “uppercase‑only” validator:

  1. Empty string – does the regex require at least one character?
  2. Strings containing spaces – are spaces allowed by `regexes.uppercase`?
  3. Non‑ASCII uppercase characters (e.g., “ÄÖÜ”, “É”, Cyrillic “Д”) – depends on
     the regex implementation.
  4. Numeric characters or symbols mixed with uppercase letters.
  5. Non‑string inputs (number, boolean, null, undefined, object, array).
  6. Very long strings – performance / stack safety (not a functional edge‑case
     but worth a sanity check).
  7. Explicit error type – the schema should emit `errors.$ZodIssueInvalidStringFormat`
     when validation fails.
*/

function isZodInvalidStringFormatError(err: unknown): boolean {
  // The concrete shape of the error depends on the library implementation.
  // We check for the presence of the known error class or a matching code.
  if (err instanceof Error) {
    // Some implementations expose a `code` property.
    // @ts-ignore – property may not exist on generic Error.
    if ((err as any).code === "invalid_string_format") return true;
  }
  // Fallback: check constructor name if the library exports a class.
  // @ts-ignore
  return err?.constructor?.name === "ZodIssueInvalidStringFormat";
}

/* -------------------------------------------------------------------------- */
/* 4️⃣ Edge‑case tests                                                       */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckUpperCase – edge cases & error handling", () => {
  const UpperCase = $ZodCheckUpperCase as unknown as (() => UpperCaseSchema);

  it("rejects an empty string (if pattern requires at least one char)", () => {
    const schema = UpperCase();
    const result = schema.safeParse("");
    // The expected behaviour depends on the regex; we assert failure.
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(isZodInvalidStringFormatError(result.error)).toBe(true);
    }
  });

  it("rejects a string containing spaces when spaces are not allowed", () => {
    const schema = UpperCase();
    const input = "UP PER";
    const result = schema.safeParse(input);
    // If the internal regex does not allow spaces, this should fail.
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(isZodInvalidStringFormatError(result.error)).toBe(true);
    }
  });

  it("accepts Unicode uppercase letters if the regex is Unicode‑aware", () => {
    const schema = UpperCase();
    const input = "ÄÖÜß".toUpperCase(); // "ÄÖÜß" → "ÄÖÜß" (ß becomes SS in some locales)
    const result = schema.safeParse(input);
    // We cannot guarantee library support; we simply assert that the test
    // documents the expected behaviour.  If the library does not support Unicode,
    // the test will fail, signalling a missing feature.
    // Adjust the expectation according to your implementation.
    // Here we assume Unicode support:
    expect(result.success).toBe(true);
  });

  it("rejects strings with numeric characters mixed in", () => {
    const schema = UpperCase();
    const result = schema.safeParse("HELLO123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(isZodInvalidStringFormatError(result.error)).toBe(true);
    }
  });

  it("rejects strings with symbols mixed in", () => {
    const schema = UpperCase();
    const result = schema.safeParse("HELLO@WORLD");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(isZodInvalidStringFormatError(result.error)).toBe(true);
    }
  });

  it.each([
    ["number", 123],
    ["boolean true", true],
    ["boolean false", false],
    ["null", null],
    ["undefined", undefined],
    ["object", { foo: "BAR" }],
    ["array", ["UPPER"]],
  ])("rejects non‑string input: %s", (_label, value) => {
    const schema = UpperCase();
    const result = schema.safeParse(value as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(isZodInvalidStringFormatError(result.error)).toBe(true);
    }
  });

  it("handles a very long uppercase string without throwing", () => {
    const schema = UpperCase();
    const longString = "A".repeat(10_000);
    const result = schema.safeParse(longString);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(longString);
    }
  });

  it("parse() throws the specific ZodIssueInvalidStringFormat error on failure", () => {
    const schema = UpperCase();
    const invalid = "invalid";
    try {
      schema.parse(invalid);
      // If we reach here, the test should fail.
      expect.fail("parse() did not throw for an invalid string");
    } catch (err) {
      expect(isZodInvalidStringFormatError(err)).toBe(true);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 5️⃣ Complete test file – all cases merged                                 */
/* -------------------------------------------------------------------------- */
```
###Test END##