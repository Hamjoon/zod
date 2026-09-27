import { describe, expect, test } from 'vitest';
import { ZodFile } from './schemas.js';
import type { ZodError } from 'zod';

// Helper to create a mock File‑like object
function mockFile(opts: { name?: string; size: number; type: string }): any {
  return {
    name: opts.name ?? 'test.txt',
    size: opts.size,
    type: opts.type,
  };
}

describe('ZodFile schema', () => {
  // -------------------------------------------------------------------------
  // 1️⃣  Basic “happy‑path” tests – each method alone
  // -------------------------------------------------------------------------
  test('min() – accepts files larger than the minimum size', () => {
    const schema = ZodFile().min(1000);
    const file = mockFile({ size: 1500, type: 'application/pdf' });
    expect(() => schema.parse(file)).not.toThrow();
    // method returns the same instance (chainable)
    expect(schema.min(1000)).toBe(schema);
  });

  test('max() – accepts files smaller than the maximum size', () => {
    const schema = ZodFile().max(2000);
    const file = mockFile({ size: 1500, type: 'application/pdf' });
    expect(() => schema.parse(file)).not.toThrow();
    expect(schema.max(2000)).toBe(schema);
  });

  test('mime() – accepts files with an allowed mime type (string)', () => {
    const schema = ZodFile().mime('image/png');
    const file = mockFile({ size: 500, type: 'image/png' });
    expect(() => schema.parse(file)).not.toThrow();
    expect(schema.mime('image/png')).toBe(schema);
  });

  test('mime() – accepts files with an allowed mime type (array)', () => {
    const schema = ZodFile().mime(['image/jpeg', 'image/png']);
    const file = mockFile({ size: 500, type: 'image/jpeg' });
    expect(() => schema.parse(file)).not.toThrow();
    expect(schema.mime(['image/jpeg', 'image/png'])).toBe(schema);
  });

  // -------------------------------------------------------------------------
  // 2️⃣  Edge‑case & error handling tests
  // -------------------------------------------------------------------------
  test('min() – throws when size argument is negative', () => {
    expect(() => ZodFile().min(-10)).toThrow();
  });

  test('min() – throws validation error when file is smaller than limit', () => {
    const schema = ZodFile().min(1000);
    const file = mockFile({ size: 800, type: 'application/pdf' });
    expect(() => schema.parse(file)).toThrowError(ZodError);
  });

  test('max() – throws when size argument is negative', () => {
    expect(() => ZodFile().max(-5)).toThrow();
  });

  test('max() – throws validation error when file exceeds the limit', () => {
    const schema = ZodFile().max(1000);
    const file = mockFile({ size: 1500, type: 'application/pdf' });
    expect(() => schema.parse(file)).toThrowError(ZodError);
  });

  test('mime() – throws when called with an empty array', () => {
    // The underlying core._mime validates the array length
    expect(() => ZodFile().mime([])).toThrow();
  });

  test('mime() – throws when called with an invalid mime string', () => {
    // Invalid mime strings (e.g. empty string) should be rejected at schema creation
    expect(() => ZodFile().mime('')).toThrow();
  });

  test('mime() – throws validation error when file mime is not allowed', () => {
    const schema = ZodFile().mime(['image/png', 'image/jpeg']);
    const file = mockFile({ size: 500, type: 'application/pdf' });
    expect(() => schema.parse(file)).toThrowError(ZodError);
  });

  // -------------------------------------------------------------------------
  // 3️⃣  Combined constraints (method chaining)
  // -------------------------------------------------------------------------
  test('chaining min, max and mime works together', () => {
    const schema = ZodFile()
      .min(500)
      .max(1500)
      .mime(['image/png', 'image/jpeg']);

    // ✅ passes – size within range and mime allowed
    const goodFile = mockFile({ size: 1000, type: 'image/png' });
    expect(() => schema.parse(goodFile)).not.toThrow();

    // ❌ fails – size too small
    const tooSmall = mockFile({ size: 400, type: 'image/png' });
    expect(() => schema.parse(tooSmall)).toThrowError(ZodError);

    // ❌ fails – size too large
    const tooLarge = mockFile({ size: 2000, type: 'image/png' });
    expect(() => schema.parse(tooLarge)).toThrowError(ZodError);

    // ❌ fails – mime not allowed
    const badMime = mockFile({ size: 1000, type: 'application/pdf' });
    expect(() => schema.parse(badMime)).toThrowError(ZodError);
  });
});
