/**
 * Vitest test suite for the ZodKSUID schema.
 *
 * The ZodKSUID schema is a custom Zod string format that validates KSUID
 * (K-Sortable Unique ID) values.  A KSUID is a 27‑character Base62 string
 * (see https://github.com/segmentio/ksuid).  The schema is exported from
 * `./schemas.js` as a Zod constructor, therefore it provides all standard
 * Zod methods (parse, safeParse, optional, nullable, array, refine, transform,
 * etc.).
 *
 * The test suite follows these steps:
 *   1. List the public methods (with signatures) that are available on the
 *      ZodKSUID instance.
 *   2. Provide a basic test for each method to verify its normal behaviour.
 *   3. Identify edge‑cases and error‑handling scenarios that should be covered.
 *   4. Add dedicated tests for those edge‑cases.
 *   5. Combine everything into a single Vitest file.
 */

import { describe, it, expect } from 'vitest';
import { ZodKSUID } from './schemas.js';
import type { ZodError } from 'zod';

/* -------------------------------------------------------------------------- */
/* 1. Public methods (extracted from Zod's type definitions)                  */
/* -------------------------------------------------------------------------- */
/**
 * The ZodKSUID schema inherits all public methods from ZodStringFormat
 * (which itself extends ZodString).  The most relevant methods for testing
 * are listed below together with their TypeScript signatures.
 *
 *   - parse(value: unknown): string
 *   - safeParse(value: unknown): { success: true; data: string } |
 *                                 { success: false; error: ZodError }
 *   - optional(): ZodOptional<ZodKSUID>
 *   - nullable(): ZodNullable<ZodKSUID>
 *   - array(): ZodArray<ZodKSUID>
 *   - refine(
 *       check: (arg: string) => boolean,
 *       message?: string | { message: string }
 *     ): this
 *   - transform<T>(transformer: (arg: string) => T): ZodTransformer<ZodKSUID, T>
 *
 * The schema also supports the generic Zod methods such as `default`,
 * `catch`, `describe`, etc., but the tests below focus on the core
 * validation‑related methods.
 */

/* -------------------------------------------------------------------------- */
/* Helper utilities                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Generates a valid KSUID string (27‑character Base62).  The implementation
 * below uses a deterministic approach that is sufficient for testing – it
 * does **not** need to be a real KSUID, only a string that matches the
 * format requirements.
 */
function generateValidKSUID(): string {
  // Base62 characters
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let ksuid = '';
  for (let i = 0; i < 27; i++) {
    ksuid += chars[Math.floor(Math.random() * chars.length)];
  }
  return ksuid;
}

/**
 * Returns a string that is the same length as a KSUID (27) but contains
 * at least one invalid character (e.g., a punctuation mark).
 */
function generateInvalidKSUID(): string {
  const valid = generateValidKSUID();
  // Replace a random position with an invalid character
  const pos = Math.floor(Math.random() * valid.length);
  const invalidChar = '!@#$%^&*()_+-=[]{}|;:\'",.<>?'.charAt(0);
  return valid.substring(0, pos) + invalidChar + valid.substring(pos + 1);
}

/* -------------------------------------------------------------------------- */
/* 2. Basic functionality tests                                               */
/* -------------------------------------------------------------------------- */

describe('ZodKSUID – basic validation', () => {
  it('parse() should return the KSUID when a valid string is provided', () => {
    const ksuid = generateValidKSUID();
    const result = ZodKSUID.parse(ksuid);
    expect(result).toBe(ksuid);
  });

  it('parse() should throw a ZodError for an invalid KSUID string', () => {
    const badKsuid = generateInvalidKSUID(); // wrong character
    expect(() => ZodKSUID.parse(badKsuid)).toThrowError(ZodError);
  });

  it('safeParse() should succeed for a valid KSUID', () => {
    const ksuid = generateValidKSUID();
    const parsed = ZodKSUID.safeParse(ksuid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toBe(ksuid);
    }
  });

  it('safeParse() should fail for a non‑string value', () => {
    const parsed = ZodKSUID.safeParse(12345);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error).toBeInstanceOf(ZodError);
    }
  });

  it('optional() should allow undefined without throwing', () => {
    const schema = ZodKSUID.optional();
    expect(() => schema.parse(undefined)).not.toThrow();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  it('nullable() should allow null without throwing', () => {
    const schema = ZodKSUID.nullable();
    expect(() => schema.parse(null)).not.toThrow();
    expect(schema.parse(null)).toBeNull();
  });

  it('array() should validate an array of valid KSUIDs', () => {
    const schema = ZodKSUID.array();
    const ksuidList = [generateValidKSUID(), generateValidKSUID()];
    const parsed = schema.parse(ksuidList);
    expect(parsed).toEqual(ksuidList);
  });

  it('array() should reject an array containing an invalid KSUID', () => {
    const schema = ZodKSUID.array();
    const ksuidList = [generateValidKSUID(), generateInvalidKSUID()];
    expect(() => schema.parse(ksuidList)).toThrowError(ZodError);
  });

  it('refine() should allow custom validation logic', () => {
    const schema = ZodKSUID.refine((val) => val.startsWith('A'), {
      message: 'KSUID must start with "A"',
    });
    const good = 'A' + generateValidKSUID().slice(1);
    const bad = 'B' + generateValidKSUID().slice(1);
    expect(() => schema.parse(good)).not.toThrow();
    expect(() => schema.parse(bad)).toThrowError(ZodError);
  });

  it('transform() should convert a KSUID string to uppercase (identity test)', () => {
    const schema = ZodKSUID.transform((val) => val.toUpperCase());
    const ksuid = generateValidKSUID().toLowerCase();
    const transformed = schema.parse(ksuid);
    expect(transformed).toBe(ksuid.toUpperCase());
  });
});

/* -------------------------------------------------------------------------- */
/* 3. Edge‑case & exception handling tests                                    */
/* -------------------------------------------------------------------------- */

describe('ZodKSUID – edge cases & error handling', () => {
  it('should reject an empty string', () => {
    expect(() => ZodKSUID.parse('')).toThrowError(ZodError);
  });

  it('should reject a string that is too short (e.g., 10 characters)', () => {
    const short = '1234567890';
    expect(() => ZodKSUID.parse(short)).toThrowError(ZodError);
  });

  it('should reject a string that is too long (e.g., 30 characters)', () => {
    const long = generateValidKSUID() + 'ABC';
    expect(() => ZodKSUID.parse(long)).toThrowError(ZodError);
  });

  it('should reject strings containing whitespace', () => {
    const ksuid = generateValidKSUID();
    const withSpace = ksuid.slice(0, 5) + ' ' + ksuid.slice(5);
    expect(() => ZodKSUID.parse(withSpace)).toThrowError(ZodError);
  });

  it('should reject null when schema is not nullable', () => {
    expect(() => ZodKSUID.parse(null)).toThrowError(ZodError);
  });

  it('should reject undefined when schema is not optional', () => {
    expect(() => ZodKSUID.parse(undefined)).toThrowError(ZodError);
  });

  it('optional().parse(null) should still reject null (null is not undefined)', () => {
    const schema = ZodKSUID.optional();
    expect(() => schema.parse(null)).toThrowError(ZodError);
  });

  it('nullable().parse(undefined) should still reject undefined (undefined is not null)', () => {
    const schema = ZodKSUID.nullable();
    expect(() => schema.parse(undefined)).toThrowError(ZodError);
  });

  it('array().parse([]) should succeed (empty array is allowed)', () => {
    const schema = ZodKSUID.array();
    expect(schema.parse([])).toEqual([]);
  });

  it('array().parse([null]) should fail unless schema is nullable', () => {
    const schema = ZodKSUID.array();
    expect(() => schema.parse([null as any])).toThrowError(ZodError);
  });

  it('array().nullable().parse(null) should succeed', () => {
    const schema = ZodKSUID.array().nullable();
    expect(schema.parse(null)).toBeNull();
  });

  it('refine() should propagate custom error messages', () => {
    const customMessage = 'Custom validation failed';
    const schema = ZodKSUID.refine(() => false, { message: customMessage });
    try {
      schema.parse(generateValidKSUID());
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
      const err = e as ZodError;
      expect(err.errors[0].message).toBe(customMessage);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 4. Combined test suite export (Vitest automatically picks up the file)    */
/* -------------------------------------------------------------------------- */
