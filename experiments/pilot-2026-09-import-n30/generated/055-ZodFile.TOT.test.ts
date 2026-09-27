/**
 * Vitest test suite for the ZodFile schema.
 *
 * The tests cover:
 *  - Typical usage of `min`, `max`, and `mime` validators.
 *  - Edge‑case handling (zero/negative limits, empty mime lists, etc.).
 *  - Error scenarios (invalid input types, out‑of‑range values, unsupported mime types).
 *
 * The ZodFile class is exported from `./schemas.js`.
 */

import { describe, expect, test } from 'vitest';
import { ZodFile } from './schemas.js';
import type { ZodError } from 'zod';

// Helper to create a mock File‑like object.
// In a Node environment `File` may not be available, so we use a plain object
// that mimics the properties used by the ZodFile validators (`size` and `type`).
function mockFile(
  size: number,
  type: string = 'application/octet-stream',
  name: string = 'mock.txt'
) {
  return {
    size,
    type,
    name,
    // The real `File` also has a `arrayBuffer` method; we add a stub to avoid
    // potential runtime errors if the schema accesses it.
    async arrayBuffer() {
      return new ArrayBuffer(size);
    },
  } as unknown as File;
}

/**
 * Utility to assert that a Zod schema throws a validation error with a
 * specific message fragment.
 */
async function expectZodError(
  schema: any,
  value: any,
  expectedMessageFragment: string
) {
  try {
    await schema.parseAsync(value);
    // If we get here the schema didn't throw – fail the test.
    expect.fail('Expected ZodError was not thrown');
  } catch (e) {
    expect(e).toBeInstanceOf(ZodError);
    const err = e as ZodError;
    // Zod aggregates messages; we just need to see our fragment somewhere.
    const messages = err.errors.map((d) => d.message).join(' ');
    expect(messages).toContain(expectedMessageFragment);
  }
}

describe('ZodFile schema', () => {
  // -------------------------------------------------------------------------
  // 1️⃣  `min` validator
  // -------------------------------------------------------------------------
  describe('min()', () => {
    test('accepts files equal to or larger than the minimum size', async () => {
      const schema = ZodFile().min(1024); // 1 KiB
      const file = mockFile(1024);
      await expect(schema.parseAsync(file)).resolves.toBe(file);
    });

    test('rejects files smaller than the minimum size', async () => {
      const schema = ZodFile().min(500);
      const file = mockFile(499);
      await expectZodError(schema, file, 'size must be greater than or equal to 500');
    });

    test('handles zero and negative limits gracefully', async () => {
      // Zero is a valid lower bound – every file should pass.
      const zeroSchema = ZodFile().min(0);
      const anyFile = mockFile(0);
      await expect(zeroSchema.parseAsync(anyFile)).resolves.toBe(anyFile);

      // Negative limits are nonsensical; the implementation should coerce or reject.
      // We expect it to behave as if the limit were 0 (most libraries do this).
      const negativeSchema = ZodFile().min(-100);
      await expect(negativeSchema.parseAsync(anyFile)).resolves.toBe(anyFile);
    });

    test('throws a clear error when `size` is not a number', async () => {
      // @ts-expect-error – intentionally passing wrong type
      const schema = ZodFile().min('large' as any);
      const file = mockFile(1000);
      await expectZodError(schema, file, 'Invalid argument');
    });
  });

  // -------------------------------------------------------------------------
  // 2️⃣  `max` validator
  // -------------------------------------------------------------------------
  describe('max()', () => {
    test('accepts files equal to or smaller than the maximum size', async () => {
      const schema = ZodFile().max(2048);
      const file = mockFile(2048);
      await expect(schema.parseAsync(file)).resolves.toBe(file);
    });

    test('rejects files larger than the maximum size', async () => {
      const schema = ZodFile().max(1500);
      const file = mockFile(1501);
      await expectZodError(schema, file, 'size must be less than or equal to 1500');
    });

    test('zero and negative limits behave as expected', async () => {
      // Zero max means only empty files are allowed.
      const zeroSchema = ZodFile().max(0);
      const emptyFile = mockFile(0);
      await expect(zeroSchema.parseAsync(emptyFile)).resolves.toBe(emptyFile);

      const nonEmptyFile = mockFile(1);
      await expectZodError(zeroSchema, nonEmptyFile, 'size must be less than or equal to 0');

      // Negative max is impossible – the schema should reject any file.
      const negativeSchema = ZodFile().max(-10);
      await expectZodError(negativeSchema, emptyFile, 'Invalid argument');
    });

    test('throws a clear error when `size` is not a number', async () => {
      // @ts-expect-error – intentionally wrong type
      const schema = ZodFile().max({ limit: 100 } as any);
      const file = mockFile(50);
      await expectZodError(schema, file, 'Invalid argument');
    });
  });

  // -------------------------------------------------------------------------
  // 3️⃣  `mime` validator
  // -------------------------------------------------------------------------
  describe('mime()', () => {
    test('accepts a single allowed mime type (string)', async () => {
      const schema = ZodFile().mime('image/png');
      const pngFile = mockFile(500, 'image/png');
      await expect(schema.parseAsync(pngFile)).resolves.toBe(pngFile);
    });

    test('accepts multiple allowed mime types (array)', async () => {
      const schema = ZodFile().mime(['image/jpeg', 'image/png']);
      const jpegFile = mockFile(500, 'image/jpeg');
      const pngFile = mockFile(500, 'image/png');
      await expect(schema.parseAsync(jpegFile)).resolves.toBe(jpegFile);
      await expect(schema.parseAsync(pngFile)).resolves.toBe(pngFile);
    });

    test('rejects files with disallowed mime types', async () => {
      const schema = ZodFile().mime(['application/pdf', 'text/plain']);
      const docFile = mockFile(500, 'application/msword');
      await expectZodError(schema, docFile, 'Invalid mime type');
    });

    test('handles empty mime list (should reject everything)', async () => {
      const schema = ZodFile().mime([]);
      const anyFile = mockFile(100, 'image/png');
      await expectZodError(schema, anyFile, 'Invalid mime type');
    });

    test('throws a clear error when mime argument is of wrong type', async () => {
      // @ts-expect-error – intentionally wrong type
      const schema = ZodFile().mime(123 as any);
      const file = mockFile(100, 'image/png');
      await expectZodError(schema, file, 'Invalid argument');
    });
  });

  // -------------------------------------------------------------------------
  // 4️⃣  Chaining of validators
  // -------------------------------------------------------------------------
  describe('method chaining', () => {
    test('combined constraints work together', async () => {
      const schema = ZodFile()
        .min(1000)               // at least 1 KiB
        .max(5000)               // at most 5 KiB
        .mime(['image/png', 'image/jpeg']);

      const goodFile = mockFile(3000, 'image/png');
      const tooSmall = mockFile(500, 'image/png');
      const tooLarge = mockFile(6000, 'image/png');
      const wrongMime = mockFile(3000, 'application/pdf');

      // Positive case
      await expect(schema.parseAsync(goodFile)).resolves.toBe(goodFile);

      // Individual failures
      await expectZodError(schema, tooSmall, 'size must be greater than or equal to 1000');
      await expectZodError(schema, tooLarge, 'size must be less than or equal to 5000');
      await expectZodError(schema, wrongMime, 'Invalid mime type');
    });

    test('order of chaining does not affect validation outcome', async () => {
      const schemaA = ZodFile().min(200).mime('image/png').max(1000);
      const schemaB = ZodFile().max(1000).mime('image/png').min(200);
      const file = mockFile(500, 'image/png');

      await expect(schemaA.parseAsync(file)).resolves.toBe(file);
      await expect(schemaB.parseAsync(file)).resolves.toBe(file);
    });
  });

  // -------------------------------------------------------------------------
  // 5️⃣  Non‑File inputs
  // -------------------------------------------------------------------------
  describe('non‑File inputs', () => {
    test('rejects plain objects that lack `size`/`type`', async () => {
      const schema = ZodFile().min(10);
      const notAFile = { foo: 'bar' };
      await expectZodError(schema, notAFile, 'Expected file');
    });

    test('rejects `null` and `undefined`', async () => {
      const schema = ZodFile().max(1000);
      await expectZodError(schema, null, 'Expected file');
      await expectZodError(schema, undefined, 'Expected file');
    });
  });
});
