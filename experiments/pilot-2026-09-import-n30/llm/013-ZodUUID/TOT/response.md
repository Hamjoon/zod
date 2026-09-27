###Test START##
```ts
/**
 * Vitest test suite for the ZodUUID schema.
 *
 * The ZodUUID schema is a specialized ZodString format that validates
 * UUID strings (RFC 4122).  The tests below cover:
 *
 * 1. Typical valid UUIDs (v1, v4, uppercase, lowercase).
 * 2. Edge‑case strings that look similar but are invalid.
 * 3. Non‑string inputs (null, undefined, numbers, objects, arrays).
 * 4. The behaviour of `parse` (throws) vs `safeParse` (returns a result object).
 * 5. The shape of the thrown `ZodError` (path, message, issues array).
 *
 * The schema is imported from `./schemas.js` as required by the prompt.
 */

import { describe, it, expect } from 'vitest';
import { ZodUUID } from './schemas.js';
import type { ZodError } from 'zod';

describe('ZodUUID schema', () => {
  /** --------------------------------------------------------------------
   *  1️⃣  Typical valid UUIDs
   * -------------------------------------------------------------------- */
  it('should successfully parse valid UUID strings (lower‑case, v1 & v4)', () => {
    const validUuids = [
      // v1
      '6fa459ea-ee8a-11d0-a765-00a0c91e6bf6',
      // v4
      '550e8400-e29b-41d4-a716-446655440000',
      // v5
      '3b241101-e2bb-4255-8caf-4136c566a962',
      // v6 (future‑compatible format)
      '1b4e28ba-2fa1-11d2-883f-0016d3cca427',
    ];

    for (const uuid of validUuids) {
      expect(() => ZodUUID.parse(uuid)).not.toThrow();
      // also verify that the returned value is exactly the input string
      expect(ZodUUID.parse(uuid)).toBe(uuid);
    }
  });

  /** --------------------------------------------------------------------
   *  2️⃣  Upper‑case UUIDs (ZodString format is case‑insensitive)
   * -------------------------------------------------------------------- */
  it('should accept upper‑case UUID strings', () => {
    const upperCaseUuid = '550E8400-E29B-41D4-A716-446655440000';
    expect(() => ZodUUID.parse(upperCaseUuid)).not.toThrow();
    expect(ZodUUID.parse(upperCaseUuid)).toBe(upperCaseUuid);
  });

  /** --------------------------------------------------------------------
   *  3️⃣  Edge‑case invalid UUID strings
   * -------------------------------------------------------------------- */
  it('should reject strings that look like UUIDs but are malformed', () => {
    const invalidUuids = [
      '', // empty
      '12345678-1234-1234-1234-1234567890', // too short
      'g550e8400-e29b-41d4-a716-446655440000', // illegal character 'g'
      '550e8400e29b41d4a716446655440000', // missing hyphens
      '550e8400-e29b-41d4-a716-4466554400000', // extra character
      '550e8400-e29b-41d4-a716-44-655440000', // misplaced hyphen
      '550e8400-e29b-41d4-a716-44 655440000', // space inside
    ];

    for (const uuid of invalidUuids) {
      expect(() => ZodUUID.parse(uuid)).toThrowError(ZodError);
    }
  });

  /** --------------------------------------------------------------------
   *  4️⃣  Non‑string inputs
   * -------------------------------------------------------------------- */
  it('should reject non‑string inputs (null, undefined, numbers, objects, arrays)', () => {
    const nonStringValues = [
      null,
      undefined,
      12345,
      true,
      false,
      {},
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      [],
      ['550e8400-e29b-41d4-a716-446655440000'],
      new Date(),
    ];

    for (const value of nonStringValues) {
      expect(() => ZodUUID.parse(value as any)).toThrowError(ZodError);
    }
  });

  /** --------------------------------------------------------------------
   *  5️⃣  safeParse – success path
   * -------------------------------------------------------------------- */
  it('safeParse should return success:true and the original value for a valid UUID', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const result = ZodUUID.safeParse(uuid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(uuid);
    }
  });

  /** --------------------------------------------------------------------
   *  6️⃣  safeParse – failure path
   * -------------------------------------------------------------------- */
  it('safeParse should return success:false with proper error details for an invalid UUID', () => {
    const uuid = 'invalid-uuid-string';
    const result = ZodUUID.safeParse(uuid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const { error } = result;
      // The error should be a ZodError instance
      expect(error).toBeInstanceOf(ZodError);
      // There should be exactly one issue for the format violation
      expect(error.issues).toHaveLength(1);
      const issue = error.issues[0];
      expect(issue.code).toBe('invalid_string');
      expect(issue.message).toMatch(/Invalid uuid/);
      // Path should be empty because we are validating the root value
      expect(issue.path).toEqual([]);
    }
  });

  /** --------------------------------------------------------------------
   *  7️⃣  Error message consistency
   * -------------------------------------------------------------------- */
  it('should produce a consistent error message for empty string', () => {
    try {
      ZodUUID.parse('');
    } catch (e) {
      const err = e as ZodError;
      const issue = err.issues[0];
      expect(issue.message).toBe('Invalid uuid');
    }
  });

  /** --------------------------------------------------------------------
   *  8️⃣  Integration with other Zod refinements (example: .optional())
   * -------------------------------------------------------------------- */
  it('should work correctly when combined with .optional()', () => {
    const optionalUuid = ZodUUID.optional();

    // undefined is allowed
    expect(() => optionalUuid.parse(undefined)).not.toThrow();

    // valid UUID passes
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(optionalUuid.parse(uuid)).toBe(uuid);

    // invalid UUID throws
    expect(() => optionalUuid.parse('not-a-uuid')).toThrowError(ZodError);
  });
});
```
###Test END##