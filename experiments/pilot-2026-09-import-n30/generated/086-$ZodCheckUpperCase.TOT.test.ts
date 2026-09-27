/**
 * Vitest test suite for the `$ZodCheckUpperCase` class.
 *
 * The class is a Zod‑style validator that ensures a string matches an
 * uppercase pattern.  It is created via `core.$constructor` and
 * automatically assigns `regexes.uppercase` as the default pattern
 * unless a custom pattern is supplied.
 *
 * The tests cover:
 *   • Default pattern assignment
 *   • Successful validation of correct uppercase strings
 *   • Rejection of invalid strings (lower‑case, mixed case, empty)
 *   • Custom pattern overrides
 *   • The shape of the internal `_zod` object (especially the
 *     `issc` error constructor)
 *
 * The test file assumes the following modules are available in the
 * same project:
 *   - `./checks.js`      – exports `$ZodCheckUpperCase`
 *   - `./regexes.js`    – exports `regexes.uppercase`
 *   - `./errors.js`     – exports `errors.$ZodIssueInvalidStringFormat`
 *
 * Adjust import paths if your project layout differs.
 */

import { describe, it, expect } from 'vitest';
import { $ZodCheckUpperCase } from './checks.js';
import { regexes } from './regexes.js';
import { errors } from './errors.js';

/**
 * Helper that mimics the public API of a Zod schema.
 *
 * The `$ZodCheckUpperCase` constructor returns an object that implements
 * the Zod‑like interface (`parse`, `safeParse`, etc.).  If the real
 * implementation differs, replace the calls below with the appropriate
 * method names.
 */
function parseWithSchema(schema: any, value: unknown) {
  // Most Zod‑style objects expose a `parse` method that throws on failure.
  // If the library uses a different name (e.g., `check`), adjust here.
  return schema.parse(value);
}

function safeParseWithSchema(schema: any, value: unknown) {
  // Returns `{ success: true, data: … }` or `{ success: false, error: … }`
  return schema.safeParse(value);
}

describe('$ZodCheckUpperCase', () => {
  /** --------------------------------------------------------------------
   *  1️⃣ Default pattern assignment
   * ------------------------------------------------------------------- */
  it('assigns the default uppercase regex when no pattern is provided', () => {
    // Instantiating without a definition should cause the constructor to
    // fall back to `regexes.uppercase`.
    const schema = new $ZodCheckUpperCase();

    // The internal definition lives under `_zod.def`.
    expect(schema._zod.def.pattern).toBe(regexes.uppercase);
  });

  /** --------------------------------------------------------------------
   *  2️⃣ Successful validation of a proper uppercase string
   * ------------------------------------------------------------------- */
  it('accepts a valid uppercase string (parse)', () => {
    const schema = new $ZodCheckUpperCase();

    // `parse` should return the original value when validation succeeds.
    const input = 'HELLO WORLD';
    const result = parseWithSchema(schema, input);
    expect(result).toBe(input);
  });

  it('accepts a valid uppercase string (safeParse)', () => {
    const schema = new $ZodCheckUpperCase();

    const input = 'VITEST';
    const outcome = safeParseWithSchema(schema, input);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.data).toBe(input);
    }
  });

  /** --------------------------------------------------------------------
   *  3️⃣ Rejection of a lowercase string
   * ------------------------------------------------------------------- */
  it('rejects a completely lowercase string (parse)', () => {
    const schema = new $ZodCheckUpperCase();

    const input = 'lowercase';
    expect(() => parseWithSchema(schema, input)).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  it('rejects a completely lowercase string (safeParse)', () => {
    const schema = new $ZodCheckUpperCase();

    const input = 'lowercase';
    const outcome = safeParseWithSchema(schema, input);
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      // The error instance should be created via the `issc` constructor.
      expect(outcome.error).toBeInstanceOf(errors.$ZodIssueInvalidStringFormat);
    }
  });

  /** --------------------------------------------------------------------
   *  4️⃣ Rejection of mixed‑case strings
   * ------------------------------------------------------------------- */
  it('rejects a mixed‑case string', () => {
    const schema = new $ZodCheckUpperCase();

    const input = 'HeLLo';
    expect(() => parseWithSchema(schema, input)).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** --------------------------------------------------------------------
   *  5️⃣ Rejection of an empty string
   * ------------------------------------------------------------------- */
  it('rejects an empty string', () => {
    const schema = new $ZodCheckUpperCase();

    const input = '';
    expect(() => parseWithSchema(schema, input)).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** --------------------------------------------------------------------
   *  6️⃣ Custom pattern override
   * ------------------------------------------------------------------- */
  it('uses a custom pattern when supplied', () => {
    // Custom definition that only allows numeric strings.
    const customDef = { pattern: /^[0-9]+$/ };
    const schema = new $ZodCheckUpperCase(customDef as any);

    // The internal pattern should be exactly the one we passed.
    expect(schema._zod.def.pattern).toBe(customDef.pattern);

    // Numeric string should pass.
    expect(() => parseWithSchema(schema, '123456')).not.toThrow();

    // Alphabetic string should fail with the same uppercase‑format error.
    expect(() => parseWithSchema(schema, 'ABC')).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** --------------------------------------------------------------------
   *  7️⃣ Internal error constructor (`issc`) verification
   * ------------------------------------------------------------------- */
  it('exposes the correct error constructor via `_zod.issc`', () => {
    const schema = new $ZodCheckUpperCase();

    // The `issc` property should reference the specific error class.
    expect(schema._zod.issc).toBe(errors.$ZodIssueInvalidStringFormat);
  });
});
