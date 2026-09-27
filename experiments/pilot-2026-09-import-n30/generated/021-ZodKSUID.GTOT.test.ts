/**
 * Vitest test suite for the ZodKSUID schema.
 *
 * The ZodKSUID schema is a custom Zod string format that validates KSUIDs
 * (27‑character Base62 identifiers).  The tests below cover:
 *   • Basic successful validation of a correct KSUID.
 *   • Rejection of malformed KSUIDs (wrong length, illegal characters, etc.).
 *   • Behaviour of the common Zod methods: parse, safeParse, optional, nullable,
 *     and default.
 *   • Edge‑case inputs such as empty strings, whitespace, non‑string values,
 *     and extremely long strings.
 *
 * The test file follows the required delimiters.
 */

import { describe, it, expect } from "vitest";
import { ZodKSUID } from "./schemas.js";

// A known‑good KSUID (27 Base‑62 characters).  You can replace it with any
// other valid KSUID if desired.
const VALID_KSUID = "0ujtsYcgvSTl8PAuAdqWYSMnLOv";

// Helper to generate an obviously invalid KSUID (wrong length)
const INVALID_KSUID_SHORT = "abc123"; // far too short
const INVALID_KSUID_LONG = `${VALID_KSUID}EXTRA`; // too long
const INVALID_KSUID_CHARS = "0ujtsYcgvSTl8PAuAdqWYSMnLØv"; // contains non‑Base62 char

describe("ZodKSUID – basic validation", () => {
  it("should successfully parse a valid KSUID", () => {
    expect(() => ZodKSUID.parse(VALID_KSUID)).not.toThrow();
    const result = ZodKSUID.parse(VALID_KSUID);
    expect(result).toBe(VALID_KSUID);
  });

  it("should reject an empty string", () => {
    expect(() => ZodKSUID.parse("")).toThrowError();
  });

  it("should reject a KSUID with incorrect length (too short)", () => {
    expect(() => ZodKSUID.parse(INVALID_KSUID_SHORT)).toThrowError();
  });

  it("should reject a KSUID with incorrect length (too long)", () => {
    expect(() => ZodKSUID.parse(INVALID_KSUID_LONG)).toThrowError();
  });

  it("should reject a KSUID containing illegal characters", () => {
    expect(() => ZodKSUID.parse(INVALID_KSUID_CHARS)).toThrowError();
  });

  it("should reject non‑string inputs (number, object, null, undefined)", () => {
    // @ts-expect-error – intentional misuse
    expect(() => ZodKSUID.parse(12345)).toThrowError();
    // @ts-expect-error – intentional misuse
    expect(() => ZodKSUID.parse({ foo: "bar" })).toThrowError();
    // @ts-expect-error – intentional misuse
    expect(() => ZodKSUID.parse(null)).toThrowError();
    // @ts-expect-error – intentional misuse
    expect(() => ZodKSUID.parse(undefined)).toThrowError();
  });
});

describe("ZodKSUID – safeParse behaviour", () => {
  it("should return success:true for a valid KSUID", () => {
    const res = ZodKSUID.safeParse(VALID_KSUID);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe(VALID_KSUID);
    }
  });

  it("should return success:false for an invalid KSUID", () => {
    const res = ZodKSUID.safeParse(INVALID_KSUID_SHORT);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.errors[0].message).toBeDefined();
    }
  });
});

describe("ZodKSUID – optional, nullable and default modifiers", () => {
  it("optional() should accept undefined without throwing", () => {
    const schema = ZodKSUID.optional();
    expect(() => schema.parse(undefined)).not.toThrow();
    const result = schema.parse(undefined);
    expect(result).toBeUndefined();
  });

  it("nullable() should accept null without throwing", () => {
    const schema = ZodKSUID.nullable();
    expect(() => schema.parse(null)).not.toThrow();
    const result = schema.parse(null);
    expect(result).toBeNull();
  });

  it("default() should replace undefined with the provided default", () => {
    const DEFAULT = VALID_KSUID;
    const schema = ZodKSUID.default(DEFAULT);
    // undefined gets replaced by the default
    const result = schema.parse(undefined);
    expect(result).toBe(DEFAULT);
    // explicit undefined also works
    const result2 = schema.parse(undefined);
    expect(result2).toBe(DEFAULT);
    // valid KSUID still passes through unchanged
    const result3 = schema.parse(VALID_KSUID);
    expect(result3).toBe(VALID_KSUID);
  });
});

describe("ZodKSUID – edge‑case strings", () => {
  it("should reject strings that are whitespace only", () => {
    expect(() => ZodKSUID.parse("   ")).toThrowError();
  });

  it("should reject strings that contain newline characters", () => {
    expect(() => ZodKSUID.parse("\n0ujtsYcgvSTl8PAuAdqWYSMnLOv")).toThrowError();
    expect(() => ZodKSUID.parse("0ujtsYcgvSTl8PAuAdqWYSMnLOv\n")).toThrowError();
  });

  it("should reject a string that is a valid length but not Base62", () => {
    const notBase62 = "!!!!!!!!!!!!!!!!!!!!!!!!!"; // 27 exclamation marks
    expect(() => ZodKSUID.parse(notBase62)).toThrowError();
  });

  it("should reject an extremely long string even if it contains a valid KSUID as a prefix", () => {
    const longString = VALID_KSUID + "A".repeat(1000);
    expect(() => ZodKSUID.parse(longString)).toThrowError();
  });
});
