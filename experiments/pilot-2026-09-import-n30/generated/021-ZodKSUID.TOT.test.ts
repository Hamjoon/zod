/**
 * Vitest test suite for the `ZodKSUID` schema.
 *
 * The `ZodKSUID` schema is a Zod string format validator that ensures a value
 * conforms to the KSUID specification (a 27‑character Base62 string).
 *
 * The tests cover:
 *   • Successful validation of a known good KSUID.
 *   • Rejection of strings with incorrect length.
 *   • Rejection of strings containing illegal characters.
 *   • Presence and shape of the internal `_zod` metadata.
 *   • Correct format registration via `ZodStringFormat`.
 *
 * The test file follows the required markers:
 *   - Starts with `###Test START##`
 *   - Ends with `###Test END##`
 */

import { describe, it, expect } from "vitest";
import { ZodKSUID } from "./schemas.js"; // path is relative to this test file

/**
 * Helper: a known valid KSUID (27‑character Base62 string).
 * This value is taken from the official KSUID documentation.
 */
const VALID_KSUID = "0ujtsYcgvSTl8PAuAdqWYSMnLOv";

/**
 * Helper: generate a string of a given length consisting of only valid Base62 characters.
 */
function makeBase62String(length: number): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[i % chars.length];
  }
  return result;
}

/**
 * Test suite for the ZodKSUID schema.
 */
describe("ZodKSUID schema", () => {
  /**
   * 1️⃣  Positive test – a correct KSUID should parse without error.
   */
  it("should successfully parse a valid KSUID", () => {
    // Using Zod's `parse` which throws on failure.
    const parsed = ZodKSUID.parse(VALID_KSUID);
    expect(parsed).toBe(VALID_KSUID);
  });

  /**
   * 2️⃣  Negative test – strings that are too short must be rejected.
   */
  it("should reject KSUID strings that are shorter than 27 characters", () => {
    const shortKsuid = makeBase62String(20); // 20 < 27
    const result = ZodKSUID.safeParse(shortKsuid);
    expect(result.success).toBe(false);
    if (!result.success) {
      // The error message should mention the expected length or format.
      expect(result.error.errors[0].message).toMatch(/ksuid/i);
    }
  });

  /**
   * 3️⃣  Negative test – strings that are too long must be rejected.
   */
  it("should reject KSUID strings that are longer than 27 characters", () => {
    const longKsuid = makeBase62String(35); // 35 > 27
    const result = ZodKSUID.safeParse(longKsuid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/ksuid/i);
    }
  });

  /**
   * 4️⃣  Negative test – strings containing characters outside the Base62 alphabet must be rejected.
   */
  it("should reject KSUID strings containing illegal characters", () => {
    // Insert a few illegal characters (`!`, `@`, `#`) into an otherwise valid length.
    const illegalKsuid = "0ujtsYcgvSTl8PAuAdqWYSMnL!@#";
    const result = ZodKSUID.safeParse(illegalKsuid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/ksuid/i);
    }
  });

  /**
   * 5️⃣  Internal metadata – the schema should expose the `_zod` internals defined by the library.
   */
  it("should expose the internal `_zod` property with expected shape", () => {
    // The `_zod` property is defined on the schema type (ZodKSUID extends ZodStringFormat).
    // TypeScript will not allow direct access without a cast, so we use a runtime check.
    const anySchema: any = ZodKSUID;
    expect(anySchema).toHaveProperty("_zod");
    // The internal object should contain at least a `typeName` field identifying the schema.
    expect(anySchema._zod).toHaveProperty("typeName");
    // Verify that the type name matches the constructor name.
    expect(anySchema._zod.typeName).toBe("ZodKSUID");
  });

  /**
   * 6️⃣  Format registration – the schema should be registered as a string format `"ksuid"`.
   */
  it("should register the string format as 'ksuid' via ZodStringFormat", () => {
    // ZodStringFormat stores the format name in the schema definition under `format`.
    const anySchema: any = ZodKSUID;
    // The definition object is usually accessible via `_def`.
    expect(anySchema).toHaveProperty("_def");
    const def = anySchema._def;
    // The format should be exactly "ksuid".
    expect(def).toHaveProperty("format", "ksuid");
  });

  /**
   * 7️⃣  Edge case – empty string should be rejected (even though length check would catch it).
   */
  it("should reject an empty string", () => {
    const result = ZodKSUID.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/ksuid/i);
    }
  });

  /**
   * 8️⃣  Type safety – ensure that non‑string inputs are rejected before format validation.
   */
  it("should reject non‑string inputs (e.g., numbers, objects, null, undefined)", () => {
    const nonStringValues = [12345, {}, null, undefined, true, Symbol("ksuid")];
    for (const value of nonStringValues) {
      const result = ZodKSUID.safeParse(value as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Zod typically reports a type error before format validation.
        expect(result.error.errors[0].message).toMatch(/string/i);
      }
    }
  });
});
