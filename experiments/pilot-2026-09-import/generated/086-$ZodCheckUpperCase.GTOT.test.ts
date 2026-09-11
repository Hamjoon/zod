import { describe, it, expect } from 'vitest';
import { $ZodCheckUpperCase } from './checks.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public API extraction (for documentation purposes)
// ---------------------------------------------------------------------------
// The exported `$ZodCheckUpperCase` is a Zod‑style schema constructor.  
// After invoking it you receive a Zod schema instance that exposes the
// standard Zod methods (parse, safeParse, refine, optional, etc.).  
// For the purpose of these tests we focus on the two most common
// validation entry points:
//
//   • parse(value: unknown): string          – throws on validation failure
//   • safeParse(value: unknown): { success: boolean; data?: string; error?: ZodError }
// ---------------------------------------------------------------------------

describe('$ZodCheckUpperCase – basic functionality', () => {
  // Create a fresh schema instance for each test suite.
  const UpperCaseSchema = $ZodCheckUpperCase();

  // -----------------------------------------------------------------------
  // ✅  Typical (happy‑path) cases
  // -----------------------------------------------------------------------
  it('accepts a plain ASCII uppercase string', () => {
    const input = 'HELLO WORLD';
    expect(UpperCaseSchema.parse(input)).toBe(input);
  });

  it('accepts a single‑character uppercase string', () => {
    expect(UpperCaseSchema.parse('A')).toBe('A');
  });

  // -----------------------------------------------------------------------
  // ❌  Typical failure cases
  // -----------------------------------------------------------------------
  it('rejects a mixed‑case string', () => {
    expect(() => UpperCaseSchema.parse('Hello')).toThrowError();
  });

  it('rejects a fully lowercase string', () => {
    expect(() => UpperCaseSchema.parse('lowercase')).toThrowError();
  });

  it('rejects a string containing numbers', () => {
    expect(() => UpperCaseSchema.parse('ABC123')).toThrowError();
  });

  it('rejects a string containing symbols', () => {
    expect(() => UpperCaseSchema.parse('UPPER!')).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 🧪  Edge‑case & exception handling tests
  // -----------------------------------------------------------------------
  it('rejects an empty string (pattern requires at least one character)', () => {
    expect(() => UpperCaseSchema.parse('')).toThrowError();
  });

  it('rejects whitespace‑only strings', () => {
    expect(() => UpperCaseSchema.parse('   ')).toThrowError();
  });

  it('rejects a string with leading/trailing spaces', () => {
    expect(() => UpperCaseSchema.parse('  ABC')).toThrowError();
    expect(() => UpperCaseSchema.parse('XYZ  ')).toThrowError();
  });

  it('rejects non‑string primitives (number, boolean, null, undefined, object)', () => {
    const badValues = [123, true, false, null, undefined, {}, []];
    badValues.forEach((val) => {
      expect(() => UpperCaseSchema.parse(val as any)).toThrowError();
    });
  });

  it('rejects Unicode uppercase letters if the default regex is ASCII‑only', () => {
    // The built‑in `regexes.uppercase` is assumed to be `/^[A-Z]+$/`.
    // Characters like Ä, Ö, Ü are not matched by that pattern.
    expect(() => UpperCaseSchema.parse('ÄÖÜ')).toThrowError();
  });

  // -----------------------------------------------------------------------
  // 🛡️  safeParse variants – ensure the error shape is as expected
  // -----------------------------------------------------------------------
  it('safeParse returns success:true for a valid uppercase string', () => {
    const result = UpperCaseSchema.safeParse('VALID');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('VALID');
    }
  });

  it('safeParse returns success:false for an invalid string', () => {
    const result = UpperCaseSchema.safeParse('Invalid');
    expect(result.success).toBe(false);
    if (!result.success) {
      // The error should be a ZodError containing at least one issue.
      expect(result.error.issues.length).toBeGreaterThan(0);
      // The issue code for string‑format problems is `$ZodIssueInvalidStringFormat`.
      const issue = result.error.issues[0];
      expect(issue.code).toBe('invalid_string');
      // The expected format is "uppercase".
      expect(issue.message).toContain('uppercase');
    }
  });

  // -----------------------------------------------------------------------
  // 🧩  Custom pattern override – ensure the constructor respects a user‑supplied regex
  // -----------------------------------------------------------------------
  it('uses a custom pattern when provided via definition object', () => {
    // Simulate a custom definition that allows only the literal "XYZ".
    const customPattern = /^XYZ$/;
    // The core.$constructor expects a definition object; we can pass it
    // directly to the factory function for this test.
    // NOTE: The actual `$ZodCheckUpperCase` export is a curried constructor,
    // so we invoke it with a custom definition object.
    const CustomUpperCase = $ZodCheckUpperCase(undefined as any, {
      pattern: customPattern,
    } as any);

    // Valid according to the custom pattern.
    expect(CustomUpperCase.parse('XYZ')).toBe('XYZ');

    // Anything else should fail.
    expect(() => CustomUpperCase.parse('ABC')).toThrowError();
    expect(() => CustomUpperCase.parse('xyz')).toThrowError();
  });
});
