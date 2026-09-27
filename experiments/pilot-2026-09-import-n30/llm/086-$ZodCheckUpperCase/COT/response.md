**###Test START##**  

```ts
/**
 * Vitest test suite for the `$ZodCheckUpperCase` schema constructor.
 *
 * The `$ZodCheckUpperCase` export is a *Zod‑style* constructor created via
 * `core.$constructor`.  In practice it behaves like a Zod schema:
 *   - It can be instantiated (`const schema = $ZodCheckUpperCase();`)
 *   - The resulting object implements the public API of `$ZodCheck<string>`
 *     (e.g. `parse`, `safeParse`, `optional`, `nullable`, …).
 *
 * The tests below therefore focus on the **validation behaviour** of the
 * generated schema – i.e. that it only accepts strings that consist solely of
 * uppercase characters – and on the edge‑cases that are relevant for a string
 * format validator.
 *
 * If the underlying implementation of `$ZodCheck` changes (e.g. method names
 * are renamed), the test suite will need to be updated accordingly.
 */

import { describe, it, expect } from 'vitest';
import { $ZodCheckUpperCase } from './checks.js';

// ---------------------------------------------------------------------------
// 1️⃣  Public API extraction (for documentation purposes only)
// ---------------------------------------------------------------------------
// The `$ZodCheck<string>` interface (imported indirectly via `$ZodCheckUpperCase`)
// typically exposes the following public methods.  The signatures are taken
// from the official Zod typings and are the ones we rely on in the tests.
//
// ```ts
// parse(value: unknown): string                     // throws on invalid input
// safeParse(value: unknown): { success: true, data: string } | { success: false, error: ZodError }
// refine(...): this                                 // chainable
// optional(): ZodOptional<string>
// nullable(): ZodNullable<string>
// array(): ZodArray<string>
// default(...): ZodDefault<string>
// // …and many other combinators that are part of the base `$ZodCheck` type.
// ```
//
// For the purpose of this test file we only need `parse` and `safeParse`,
// which are the core validation entry points.
//
// ---------------------------------------------------------------------------
// 2️⃣  Basic functionality tests
// ---------------------------------------------------------------------------

describe('$ZodCheckUpperCase – basic validation', () => {
  // Instantiate the schema once for the whole suite.
  const UpperCaseSchema = $ZodCheckUpperCase();

  it('should accept a plain uppercase ASCII string', () => {
    const input = 'HELLO';
    expect(UpperCaseSchema.parse(input)).toBe(input);
  });

  it('should accept an empty string (empty string matches the default uppercase regex)', () => {
    // The default `regexes.uppercase` is `/^[A-Z]*$/` – the `*` quantifier
    // allows the empty string, which is the behaviour of Zod's built‑in
    // `z.string().uppercase()`.
    const input = '';
    expect(UpperCaseSchema.parse(input)).toBe(input);
  });

  it('should reject a mixed‑case string', () => {
    const input = 'HelloWorld';
    expect(() => UpperCaseSchema.parse(input)).toThrowError();
  });

  it('should reject a lowercase string', () => {
    const input = 'lowercase';
    expect(() => UpperCaseSchema.parse(input)).toThrowError();
  });

  it('should reject a string containing numbers or symbols', () => {
    const inputs = ['ABC123', 'UPPER!', '123', '!@#'];
    for (const val of inputs) {
      expect(() => UpperCaseSchema.parse(val)).toThrowError();
    }
  });

  it('should reject non‑string values (number, boolean, object, null, undefined)', () => {
    const badValues = [42, true, {}, null, undefined, Symbol('UP')];
    for (const val of badValues) {
      expect(() => UpperCaseSchema.parse(val as any)).toThrowError();
    }
  });

  it('safeParse returns success for valid uppercase strings', () => {
    const result = UpperCaseSchema.safeParse('ZOD');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('ZOD');
    }
  });

  it('safeParse returns failure for invalid strings', () => {
    const result = UpperCaseSchema.safeParse('Zod');
    expect(result.success).toBe(false);
    if (!result.success) {
      // The error should contain at least one issue with code
      // `invalid_string` (or the custom issue defined in `$ZodIssueInvalidStringFormat`).
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 3️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------

describe('$ZodCheckUpperCase – edge cases & custom pattern handling', () => {
  /**
   * The default regex (`regexes.uppercase`) is `/^[A-Z]*$/`.  It matches
   * only ASCII uppercase letters and allows the empty string.
   *
   * Edge cases we want to verify:
   *   • Unicode uppercase characters (e.g. “Ä”, “Ω”, “ß” is *not* uppercase)
   *   • Strings with whitespace
   *   • Overriding the default pattern via a custom definition object.
   */

  it('should reject Unicode uppercase letters that are not covered by the default ASCII regex', () => {
    const schema = $ZodCheckUpperCase();
    const unicodeUpper = 'ÄÖÜ'; // German uppercase umlauts
    expect(() => schema.parse(unicodeUpper)).toThrowError();
  });

  it('should reject strings that contain whitespace', () => {
    const schema = $ZodCheckUpperCase();
    const withSpace = 'HEL LO';
    expect(() => schema.parse(withSpace)).toThrowError();
  });

  it('should allow overriding the default pattern via a definition object', () => {
    // The constructor created by `core.$constructor` accepts an optional
    // definition object as its first argument.  By providing a custom
    // `pattern` we can change what is considered “uppercase”.
    const customPattern = /^[A-ZÄÖÜ]*$/; // include German umlauts
    // @ts-expect-error – the exact shape of the definition is not exported,
    // but we can pass a plain object with a `pattern` property.
    const schema = $ZodCheckUpperCase({ pattern: customPattern });

    // Now the same Unicode string should be accepted.
    const unicodeUpper = 'ÄÖÜ';
    expect(schema.parse(unicodeUpper)).toBe(unicodeUpper);
  });

  it('should still reject strings that contain disallowed characters even with a custom pattern', () => {
    const customPattern = /^[A-Z]+$/; // explicit “one or more” ASCII uppercase
    // @ts-expect-error – see comment above.
    const schema = $ZodCheckUpperCase({ pattern: customPattern });

    // Empty string should now be rejected because `+` requires at least one char.
    expect(() => schema.parse('')).toThrowError();

    // Mixed case should also be rejected.
    expect(() => schema.parse('AbC')).toThrowError();
  });

  it('internal `_zod` property should contain the resolved pattern', () => {
    const schema = $ZodCheckUpperCase();
    // The internal representation is stored under the `_zod` key.
    // We assert that the pattern is a RegExp and matches the default.
    const internal = (schema as any)._zod;
    expect(internal).toBeDefined();
    expect(internal.def).toBeDefined();
    expect(internal.def.pattern).toBeInstanceOf(RegExp);
    // The default pattern should be the same as `regexes.uppercase`.
    // Since we cannot import `regexes` directly, we perform a behavioural check:
    const testStr = 'ABC';
    expect(internal.def.pattern.test(testStr)).toBe(true);
    expect(internal.def.pattern.test('AbC')).toBe(false);
  });
});
```

**Explanation of the test suite**

| Section | Purpose |
|---------|---------|
| **Public API extraction** | Lists the expected public methods (`parse`, `safeParse`, …) for documentation; the actual tests only need `parse` and `safeParse`. |
| **Basic functionality** | Verifies that the schema accepts valid uppercase strings (including the empty string) and rejects all other inputs, both via `parse` (exception) and `safeParse` (result object). |
| **Edge‑case & exception handling** | Covers special situations: Unicode characters, whitespace, empty‑string handling when the pattern is overridden, and ensures the internal `_zod` representation holds the resolved regex. |
| **Custom pattern** | Demonstrates that the constructor can be supplied with a custom `pattern` definition, altering validation behaviour as intended. |

All tests are written with Vitest’s `describe`, `it`, and `expect` APIs and are fully self‑contained.  

**###Test END##**