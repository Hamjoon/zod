###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniCUID2` schema.
 *
 * The `ZodMiniCUID2` export is a Zod‑like constructor that validates CUID2 strings.
 * It inherits all public methods from the underlying Zod string schema
 * (e.g. `parse`, `safeParse`, `parseAsync`, `safeParseAsync`, `refine`, …).
 *
 * The tests below cover:
 *   1. Basic usage of the most common public methods.
 *   2. Typical valid CUID2 values.
 *   3. Edge‑case inputs (empty string, wrong length, illegal characters, non‑string types).
 *   4. Proper error handling (ZodError is thrown / returned).
 *
 * If the internal implementation of `core.$ZodCUID2` or `ZodMiniStringFormat`
 * changes, these tests will highlight regressions.
 */

import { describe, expect, test } from 'vitest';
import { ZodMiniCUID2 } from './schemas.js';
import type { ZodError } from 'zod';

// ---------------------------------------------------------------------------
// Helper – a collection of sample CUID2 strings (generated via the official
// CUID2 library). These are known‑good values that should pass validation.
// ---------------------------------------------------------------------------
const VALID_CUID2_SAMPLES = [
  'ck1e5v9x0000x7c8v5z6g9h2', // 25‑char CUID2 (default length)
  'ck1e5v9x0000x7c8v5z6g9h2a', // 26‑char (extended) – still valid for many implementations
];

// ---------------------------------------------------------------------------
// Public methods extracted from the Zod schema (inherited from ZodString)
// ---------------------------------------------------------------------------
type ZodMiniCUID2Methods = {
  parse: (value: unknown) => string;
  safeParse: (value: unknown) => { success: true; data: string } | { success: false; error: ZodError };
  parseAsync: (value: unknown) => Promise<string>;
  safeParseAsync: (value: unknown) => Promise<{ success: true; data: string } | { success: false; error: ZodError }>;
  // Additional Zod methods (refine, superRefine, etc.) are also available,
  // but the core validation behaviour is exercised via the four methods above.
};

describe('ZodMiniCUID2 – public API surface', () => {
  // -----------------------------------------------------------------------
  // 1️⃣ Basic sanity checks – the schema instance should expose the expected methods.
  // -----------------------------------------------------------------------
  test('exposes expected public methods', () => {
    const schema = ZodMiniCUID2();
    const expectedMethods: (keyof ZodMiniCUID2Methods)[] = [
      'parse',
      'safeParse',
      'parseAsync',
      'safeParseAsync',
    ];
    for (const method of expectedMethods) {
      expect(typeof (schema as any)[method]).toBe('function');
    }
  });
});

describe('ZodMiniCUID2 – successful validation (happy path)', () => {
  // -----------------------------------------------------------------------
  // 2️⃣ Valid CUID2 strings should be accepted by all parsing methods.
  // -----------------------------------------------------------------------
  test.each(VALID_CUID2_SAMPLES)('parse("%s") returns the same string', (cuid) => {
    const schema = ZodMiniCUID2();
    expect(schema.parse(cuid)).toBe(cuid);
  });

  test.each(VALID_CUID2_SAMPLES)('safeParse("%s") reports success', (cuid) => {
    const schema = ZodMiniCUID2();
    const result = schema.safeParse(cuid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(cuid);
    }
  });

  test.each(VALID_CUID2_SAMPLES)('parseAsync("%s") resolves to the same string', async (cuid) => {
    const schema = ZodMiniCUID2();
    await expect(schema.parseAsync(cuid)).resolves.toBe(cuid);
  });

  test.each(VALID_CUID2_SAMPLES)('safeParseAsync("%s") reports success', async (cuid) => {
    const schema = ZodMiniCUID2();
    const result = await schema.safeParseAsync(cuid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(cuid);
    }
  });
});

describe('ZodMiniCUID2 – edge cases & invalid inputs', () => {
  // -----------------------------------------------------------------------
  // 3️⃣ Invalid inputs – we expect a ZodError to be thrown (sync) or rejected (async).
  // -----------------------------------------------------------------------
  const INVALID_VALUES: Array<{ value: unknown; description: string }> = [
    { value: '', description: 'empty string' },
    { value: 'c', description: 'single character' },
    { value: 'ck1e5v9x0000x7c8v5z6g9h', description: 'one character short' },
    { value: 'ck1e5v9x0000x7c8v5z6g9h2!!', description: 'contains illegal characters' },
    { value: '1234567890123456789012345', description: 'numeric only string' },
    { value: 12345, description: 'number type' },
    { value: null, description: 'null value' },
    { value: undefined, description: 'undefined value' },
    { value: {}, description: 'plain object' },
    { value: [], description: 'empty array' },
  ];

  test.each(INVALID_VALUES)('parse throws ZodError for $description', ({ value }) => {
    const schema = ZodMiniCUID2();
    expect(() => schema.parse(value as any)).toThrowError(ZodError);
  });

  test.each(INVALID_VALUES)('safeParse reports failure for $description', ({ value }) => {
    const schema = ZodMiniCUID2();
    const result = schema.safeParse(value as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
    }
  });

  test.each(INVALID_VALUES)('parseAsync rejects with ZodError for $description', async ({ value }) => {
    const schema = ZodMiniCUID2();
    await expect(schema.parseAsync(value as any)).rejects.toBeInstanceOf(ZodError);
  });

  test.each(INVALID_VALUES)('safeParseAsync reports failure for $description', async ({ value }) => {
    const schema = ZodMiniCUID2();
    const result = await schema.safeParseAsync(value as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ZodError);
    }
  });
});

describe('ZodMiniCUID2 – custom refinement (example of additional public method)', () => {
  // -----------------------------------------------------------------------
  // 4️⃣ Demonstrate that additional Zod methods (e.g., `refine`) are still
  //     functional after the constructor runs.
  // -----------------------------------------------------------------------
  test('refine can enforce a custom length constraint', () => {
    const schema = ZodMiniCUID2().refine((val) => val.length === 25, {
      message: 'CUID2 must be exactly 25 characters long',
    });

    // Valid length – should pass
    expect(() => schema.parse('ck1e5v9x0000x7c8v5z6g9h2')).not.toThrow();

    // Invalid length – should throw
    expect(() => schema.parse('ck1e5v9x0000x7c8v5z6g9h2a')).toThrowError(ZodError);
  });
});
```
###Test END##