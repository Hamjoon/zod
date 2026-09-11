/**
 * Vitest test suite for the `$ZodCheckUpperCase` class.
 *
 * The class is a Zod‑style validator that ensures a string matches an
 * uppercase pattern.  It is created via `core.$constructor` and internally
 * uses `$ZodCheckStringFormat.init` with a default regex `regexes.uppercase`.
 *
 * The tests cover:
 *   • Default pattern assignment
 *   • Successful validation of uppercase strings (including Unicode)
 *   • Rejection of non‑uppercase strings with the correct Zod issue
 *   • Edge‑case handling (empty string, whitespace, numbers, mixed case)
 *   • Custom pattern override behaviour
 *   • Internal `_zod` structure sanity checks
 *
 * The test file is written for Vitest (https://vitest.dev) and assumes the
 * library exports the following symbols:
 *   - `$ZodCheckUpperCase` (the constructor)
 *   - `regexes.uppercase` (the default RegExp)
 *   - `errors.$ZodIssueInvalidStringFormat` (the error class/identifier)
 *
 * If any of these imports are unavailable in the actual project, they can be
 * mocked accordingly.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { $ZodCheckUpperCase } from "./checks.js";
import { regexes } from "./regexes.js"; // assumed location
import { errors } from "./errors.js";   // assumed location

/**
 * Helper to create a fresh instance of the check.
 * The constructor signature is `(inst, def) => { … }` where `inst` is the
 * object being constructed and `def` is the definition object.
 *
 * In practice `$ZodCheckUpperCase` behaves like a class, so we can instantiate
 * it with `new $ZodCheckUpperCase()` (the underlying `$constructor` returns a
 * class).  The resulting instance is expected to expose a `parse` method
 * (standard Zod API) and an internal `_zod` property.
 */
function createUpperCaseCheck(customDef?: Partial<{
  pattern: RegExp;
}>) {
  // The `$constructor` returns a class; we can instantiate it directly.
  // If the library uses a different factory pattern, adjust accordingly.
  const CheckClass = $ZodCheckUpperCase as unknown as {
    new (def?: any): {
      parse: (value: unknown) => string;
      safeParse: (value: unknown) => { success: boolean; data?: string; error?: any };
      _zod: any;
    };
  };
  return new CheckClass(customDef);
}

/**
 * Test suite.
 */
describe("$ZodCheckUpperCase", () => {
  let check: ReturnType<typeof createUpperCaseCheck>;

  beforeEach(() => {
    // Fresh instance before each test to avoid state leakage.
    check = createUpperCaseCheck();
  });

  /** -----------------------------------------------------------------------
   *  1️⃣ Default pattern assignment
   * ----------------------------------------------------------------------- */
  it("assigns the default uppercase regex when no pattern is provided", () => {
    // The internal definition should have `def.pattern` equal to `regexes.uppercase`.
    expect(check._zod.def.pattern).toBe(regexes.uppercase);
  });

  /** -----------------------------------------------------------------------
   *  2️⃣ Successful validation of typical uppercase strings
   * ----------------------------------------------------------------------- */
  it("accepts plain ASCII uppercase strings", () => {
    const result = check.parse("HELLO WORLD");
    expect(result).toBe("HELLO WORLD");
  });

  /** -----------------------------------------------------------------------
   *  3️⃣ Unicode uppercase handling
   * ----------------------------------------------------------------------- */
  it("accepts Unicode uppercase characters", () => {
    const unicodeStr = "ÄÖÜß".toUpperCase(); // "ÄÖÜß" -> "ÄÖÜß" (ß becomes SS in some locales, but we keep it)
    const result = check.parse(unicodeStr);
    expect(result).toBe(unicodeStr);
  });

  /** -----------------------------------------------------------------------
   *  4️⃣ Rejection of non‑uppercase strings
   * ----------------------------------------------------------------------- */
  it("rejects strings containing lowercase letters", () => {
    const bad = "Hello";
    const parseFn = () => check.parse(bad);
    expect(parseFn).toThrowError(errors.$ZodIssueInvalidStringFormat);
  });

  /** -----------------------------------------------------------------------
   *  5️⃣ Edge case: empty string
   * ----------------------------------------------------------------------- */
  it("rejects an empty string (no characters to be uppercase)", () => {
    const parseFn = () => check.parse("");
    expect(parseFn).toThrowError(errors.$ZodIssueInvalidStringFormat);
  });

  /** -----------------------------------------------------------------------
   *  6️⃣ Edge case: numeric characters mixed with uppercase
   * ----------------------------------------------------------------------- */
  it("accepts uppercase strings that contain numbers", () => {
    const result = check.parse("VERSION2");
    expect(result).toBe("VERSION2");
  });

  /** -----------------------------------------------------------------------
   *  7️⃣ Edge case: whitespace handling
   * ----------------------------------------------------------------------- */
  it("accepts uppercase strings that contain spaces and tabs", () => {
    const result = check.parse("UPPER CASE\tTEST");
    expect(result).toBe("UPPER CASE\tTEST");
  });

  /** -----------------------------------------------------------------------
   *  8️⃣ Edge case: symbols and punctuation
   * ----------------------------------------------------------------------- */
  it("accepts uppercase strings that contain symbols", () => {
    const result = check.parse("HELLO!@#");
    expect(result).toBe("HELLO!@#");
  });

  /** -----------------------------------------------------------------------
   *  9️⃣ Custom pattern override
   * ----------------------------------------------------------------------- */
  it("uses a custom pattern when supplied", () => {
    const customPattern = /^ABC$/; // only the exact string "ABC" is allowed
    const customCheck = createUpperCaseCheck({ pattern: customPattern });

    // Internals should reflect the custom pattern
    expect(customCheck._zod.def.pattern).toBe(customPattern);

    // Valid according to custom pattern
    expect(customCheck.parse("ABC")).toBe("ABC");

    // Invalid according to custom pattern, even though it is uppercase
    const parseFn = () => customCheck.parse("ABCD");
    expect(parseFn).toThrowError(errors.$ZodIssueInvalidStringFormat);
  });

  /** -----------------------------------------------------------------------
   *  10️⃣ safeParse API sanity check
   * ----------------------------------------------------------------------- */
  it("provides a safeParse method that returns success flag", () => {
    const success = check.safeParse("VALID");
    expect(success.success).toBe(true);
    expect(success.data).toBe("VALID");

    const failure = check.safeParse("Invalid");
    expect(failure.success).toBe(false);
    expect(failure.error).toBeInstanceOf(errors.$ZodIssueInvalidStringFormat);
  });

  /** -----------------------------------------------------------------------
   *  11️⃣ Internal `_zod` structure verification
   * ----------------------------------------------------------------------- */
  it("exposes the expected internal structure", () => {
    // `_zod` should contain `def` and `issc` (the issue constructor)
    expect(check._zod).toHaveProperty("def");
    expect(check._zod).toHaveProperty("issc", errors.$ZodIssueInvalidStringFormat);
    // `def` should be an object that extends `$ZodCheckUpperCaseDef`
    expect(check._zod.def).toMatchObject({
      // The generic type argument is "uppercase", but we only verify presence
      // of the `pattern` property which is set by the constructor.
      pattern: regexes.uppercase,
    });
  });
});
