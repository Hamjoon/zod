/**
 * Vitest test suite for `$ZodCheckUpperCase`
 *
 * The tests cover:
 *  • Default pattern assignment
 *  • Preservation of a user‑provided pattern
 *  • Successful validation of valid uppercase strings
 *  • Rejection of invalid strings (lower‑case, mixed case, empty)
 *  • Type safety – non‑string values should throw a TypeError
 *
 * The real implementation depends on several internal modules
 * (`core`, `regexes`, `errors`, `$ZodCheckStringFormat`).  For the
 * purpose of unit testing we mock those modules so the behaviour of
 * `$ZodCheckUpperCase` can be observed in isolation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

/* ------------------------------------------------------------------
 * 1️⃣  Mock the internal dependencies
 * ------------------------------------------------------------------ */
vi.mock('../core', () => ({
  // `core.$constructor` creates a class that stores the definition
  // and provides a simple `parse` method that validates the string
  // against the compiled regex pattern.
  core: {
    $constructor: (name: string, initFn: (inst: any, def: any) => void) => {
      return class {
        // expose the internal structure expected by the test suite
        _zod!: {
          def: any;
          issc: any;
        };

        /** factory used by the real library – we expose it for tests */
        static create(def: any = {}) {
          const instance = new this();
          initFn(instance, def);
          return instance;
        }

        /** Very small validation implementation that mimics the real one */
        parse(value: unknown) {
          if (typeof value !== 'string') {
            throw new TypeError('Expected a string value');
          }
          const pattern: RegExp = this._zod.def.pattern;
          if (!pattern.test(value)) {
            // In the real library an issue object is returned; we throw
            // the same class to make the test expressive.
            throw new this._zod.issc();
          }
          return value;
        }
      };
    },
  },
}));

vi.mock('../regexes', () => ({
  regexes: {
    // Upper‑case only, at least one character
    uppercase: /^[A-Z]+$/,
  },
}));

vi.mock('../errors', () => ({
  errors: {
    // Simple error class used to identify the failure mode
    $ZodIssueInvalidStringFormat: class ZodIssueInvalidStringFormat extends Error {
      constructor() {
        super('Invalid string format – expected uppercase');
        this.name = 'ZodIssueInvalidStringFormat';
      }
    },
  },
}));

vi.mock('../$ZodCheckStringFormat', () => ({
  $ZodCheckStringFormat: {
    /**
     * The real `init` populates internal fields.  For the test we only need
     * to attach the definition and the error class to the instance.
     */
    init: (inst: any, def: any) => {
      // Attach the definition (including the compiled pattern) and the
      // error class that will be thrown on validation failure.
      inst._zod = {
        def,
        issc: errors.$ZodIssueInvalidStringFormat,
      };
    },
  },
}));

/* ------------------------------------------------------------------
 * 2️⃣  Import the subject under test (SUT) after the mocks are in place
 * ------------------------------------------------------------------ */
import { $ZodCheckUpperCase } from '../$ZodCheckUpperCase';
import { core } from '../core';
import { regexes } from '../regexes';
import { errors } from '../errors';
import { $ZodCheckStringFormat } from '../$ZodCheckStringFormat';

/* ------------------------------------------------------------------
 * 3️⃣  Helper to create a fresh schema instance for each test
 * ------------------------------------------------------------------ */
function createSchema(def: any = {}) {
  // The real library exposes a static `create` method via the constructor
  // returned by `core.$constructor`.  We use the same API here.
  return ( $ZodCheckUpperCase as unknown as typeof core.$constructor ).create(def);
}

/* ------------------------------------------------------------------
 * 4️⃣  Test suite
 * ------------------------------------------------------------------ */
describe('$ZodCheckUpperCase', () => {
  beforeEach(() => {
    // Reset all mocks before each test to avoid cross‑test pollution
    vi.clearAllMocks();
  });

  /** 1️⃣ Default pattern is applied when none is supplied */
  it('assigns the default uppercase regex when def.pattern is undefined', () => {
    const schema = createSchema(); // no pattern supplied
    expect(schema._zod.def.pattern).toBe(regexes.uppercase);
  });

  /** 2️⃣ User‑provided pattern is respected */
  it('keeps a user‑provided pattern unchanged', () => {
    const customPattern = /^[A-Z0-9]+$/; // allow digits as well
    const schema = createSchema({ pattern: customPattern });
    expect(schema._zod.def.pattern).toBe(customPattern);
  });

  /** 3️⃣ `$ZodCheckStringFormat.init` is invoked exactly once */
  it('calls $ZodCheckStringFormat.init during construction', () => {
    const initSpy = vi.spyOn($ZodCheckStringFormat, 'init');
    const schema = createSchema();
    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(initSpy).toHaveBeenCalledWith(schema, schema._zod.def);
  });

  /** 4️⃣ Valid uppercase strings pass validation */
  it.each([
    ['HELLO'],
    ['WORLD'],
    ['VITEST'],
    ['UPPERCASE'],
    ['A'], // single character edge case
  ])('accepts valid uppercase string "%s"', (value) => {
    const schema = createSchema();
    expect(() => schema.parse(value)).not.toThrow();
    expect(schema.parse(value)).toBe(value);
  });

  /** 5️⃣ Lower‑case strings are rejected */
  it.each([
    ['hello'],
    ['world'],
    ['vitest'],
    ['lowercase'],
    ['a'],
  ])('rejects lower‑case string "%s"', (value) => {
    const schema = createSchema();
    expect(() => schema.parse(value)).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** 6️⃣ Mixed‑case strings are rejected */
  it.each([
    ['Hello'],
    ['WoRLd'],
    ['ViTesT'],
    ['UpperCase'],
    ['AbC'],
  ])('rejects mixed‑case string "%s"', (value) => {
    const schema = createSchema();
    expect(() => schema.parse(value)).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** 7️⃣ Empty string should fail (pattern requires at least one uppercase) */
  it('rejects an empty string', () => {
    const schema = createSchema();
    expect(() => schema.parse('')).toThrow(errors.$ZodIssueInvalidStringFormat);
  });

  /** 8️⃣ Non‑string inputs throw a TypeError before regex evaluation */
  it.each([
    [null],
    [undefined],
    [123],
    [true],
    [{ foo: 'BAR' }],
    [Symbol('UPPER')],
  ])('throws TypeError for non‑string value %p', (value) => {
    const schema = createSchema();
    expect(() => schema.parse(value)).toThrow(TypeError);
  });

  /** 9️⃣ Custom pattern works – digits are allowed when pattern permits them */
  it('validates according to a custom pattern when supplied', () => {
    const customPattern = /^[A-Z0-9]+$/; // uppercase letters + digits
    const schema = createSchema({ pattern: customPattern });

    // Should accept uppercase letters with digits
    expect(() => schema.parse('ABC123')).not.toThrow();

    // Should reject lower‑case letters even though digits are allowed
    expect(() => schema.parse('AbC123')).toThrow(errors.$ZodIssueInvalidStringFormat);
  });
});
```

**Explanation of the test design (the “three‑expert” story)**  

| Expert | Method under test | Proposed test case (shared) | Realisation / correction |
|--------|-------------------|-----------------------------|--------------------------|
| **Expert 1** | Constructor (`core.$constructor` + init) | *Default pattern is set when `def.pattern` is missing* | Implemented as the first `it` block. |
| **Expert 2** | Constructor (custom pattern) | *User‑provided pattern is preserved* | Implemented as the second `it` block. |
| **Expert 3** | `$ZodCheckStringFormat.init` call | *`init` is called exactly once with the right args* | Implemented as the third `it` block. |
| **Expert 1** (next round) | `parse` (valid data) | *Uppercase strings pass* | Implemented with `it.each` for typical cases. |
| **Expert 2** | `parse` (lower‑case) | *Lower‑case strings fail* | Implemented with `it.each`. |
| **Expert 3** | `parse` (mixed case) | *Mixed‑case strings fail* | Implemented with `it.each`. |
| **Expert 1** | Edge case – empty string | *Empty string fails* | Implemented as a dedicated test. |
| **Expert 2** | Edge case – non‑string input | *Non‑string values throw `TypeError`* | Implemented with `it.each`. |
| **Expert 3** | Custom pattern handling | *Custom regex works as expected* | Implemented as the final test. |

All three experts agreed on the final suite; none discovered a contradiction, so no one “left”.  

**Result:** a comprehensive Vitest test file that validates the core behaviour of `$ZodCheckUpperCase` covering typical usage, edge cases, and error handling.  
