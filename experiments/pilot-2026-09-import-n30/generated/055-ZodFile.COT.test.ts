/**
 * Vitest test suite for the `ZodFile` class.
 *
 * The class is exported from `./schemas.js` and provides three public
 * chainable methods:
 *
 *   - `min(size: number, params?: string | core.$ZodCheckMinSizeParams): this`
 *   - `max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this`
 *   - `mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this`
 *
 * The tests below cover:
 *   1. Basic functionality – each method returns the same instance (chainable).
 *   2. Acceptance of both overload signatures (plain string vs. object params).
 *   3. Edge‑case and error handling:
 *        • Invalid `size` values for `min` / `max`.
 *        • Invalid `types` values for `mime` (empty array, non‑string values, etc.).
 *
 * Because the internal implementation of the checks (`core._minSize`, `core._maxSize`,
 * `core._mime`) is not part of the public API, the tests focus on the observable
 * behaviour (return value and thrown errors) rather than the exact shape of the
 * internal check objects.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ZodFile } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – create a fresh ZodFile instance before each test.
// The actual constructor used by the library is a static `create` method
// (the pattern used by Zod’s own types). If the library exposes a different
// way to obtain an instance, adjust the `getSchema` function accordingly.
function getSchema() {
  // Most Zod types expose a static `create` method; we fall back to `new`
  // in case the library uses a class constructor directly.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return typeof ZodFile.create === 'function' ? ZodFile.create() : new ZodFile();
}

// ---------------------------------------------------------------------------
// 1️⃣  Public method signatures (extracted from the source)
/*
  min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
  max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
  mime(
    types: util.MimeTypes | Array<util.MimeTypes>,
    params?: string | core.$ZodCheckMimeTypeParams
  ): this;
*/

describe('ZodFile – public API', () => {
  let schema: ReturnType<typeof getSchema>;

  beforeEach(() => {
    schema = getSchema();
  });

  // -----------------------------------------------------------------------
  // Basic (happy‑path) tests – each method should be chainable and accept
  // both overloads (plain string vs. object params).
  // -----------------------------------------------------------------------
  it('min() returns the same instance (chainable) with numeric size', () => {
    const result = schema.min(1024);
    expect(result).toBe(schema);
  });

  it('min() accepts a string as the second argument (custom message)', () => {
    const result = schema.min(512, 'File is too small');
    expect(result).toBe(schema);
  });

  it('max() returns the same instance (chainable) with numeric size', () => {
    const result = schema.max(5_242_880); // 5 MB
    expect(result).toBe(schema);
  });

  it('max() accepts an object as the second argument (params object)', () => {
    const params = { message: 'File exceeds maximum size' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – we don’t have the exact type definition for the params object.
    const result = schema.max(2_097_152, params);
    expect(result).toBe(schema);
  });

  it('mime() accepts a single MIME type string', () => {
    const result = schema.mime('image/png');
    expect(result).toBe(schema);
  });

  it('mime() accepts an array of MIME type strings', () => {
    const result = schema.mime(['image/png', 'image/jpeg']);
    expect(result).toBe(schema);
  });

  it('mime() accepts a string as the second argument (custom message)', () => {
    const result = schema.mime('application/pdf', 'Only PDFs are allowed');
    expect(result).toBe(schema);
  });

  // -----------------------------------------------------------------------
  // 2️⃣  Edge‑case & exception handling tests
  // -----------------------------------------------------------------------
  describe('Edge‑case & error handling', () => {
    // ---- min() edge cases -------------------------------------------------
    it('min() throws when size is negative', () => {
      // The underlying implementation should reject negative numbers.
      // If it silently accepts them, the test will fail – which is the
      // intended signal that the library needs stricter validation.
      expect(() => schema.min(-100)).toThrow();
    });

    it('min() throws when size is NaN', () => {
      // @ts-ignore – deliberately passing a non‑number.
      expect(() => schema.min(NaN)).toThrow();
    });

    it('min() throws when size is not a number (e.g., string)', () => {
      // @ts-ignore – deliberately passing a wrong type.
      expect(() => schema.min('large')).toThrow();
    });

    // ---- max() edge cases -------------------------------------------------
    it('max() throws when size is negative', () => {
      expect(() => schema.max(-1)).toThrow();
    });

    it('max() throws when size is Infinity', () => {
      expect(() => schema.max(Infinity)).toThrow();
    });

    it('max() throws when size is not a number', () => {
      // @ts-ignore – deliberately wrong type.
      expect(() => schema.max({} as any)).toThrow();
    });

    // ---- mime() edge cases ------------------------------------------------
    it('mime() throws when given an empty array', () => {
      expect(() => schema.mime([])).toThrow();
    });

    it('mime() throws when array contains non‑string values', () => {
      // @ts-ignore – intentionally invalid array content.
      expect(() => schema.mime([123, null])).toThrow();
    });

    it('mime() throws when the first argument is neither string nor array', () => {
      // @ts-ignore – intentionally invalid argument.
      expect(() => schema.mime(42 as any)).toThrow();
    });

    it('mime() throws when an empty string is supplied', () => {
      expect(() => schema.mime('')).toThrow();
    });
  });
});
