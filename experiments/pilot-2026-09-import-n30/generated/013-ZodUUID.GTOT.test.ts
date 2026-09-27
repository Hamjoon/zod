import { describe, expect, test } from 'vitest';
import { ZodUUID } from './schemas.js';

// Helper – a known‑good UUID (v4 style)
const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('ZodUUID – core validation', () => {
  // -----------------------------------------------------------------
  // 1️⃣ Basic happy‑path tests (one per public method)
  // -----------------------------------------------------------------
  test('parse() accepts a valid UUID', () => {
    expect(ZodUUID.parse(VALID_UUID)).toBe(VALID_UUID);
  });

  test('safeParse() returns success for a valid UUID', () => {
    const result = ZodUUID.safeParse(VALID_UUID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(VALID_UUID);
  });

  test('optional() permits undefined', () => {
    const schema = ZodUUID.optional();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  test('nullable() permits null', () => {
    const schema = ZodUUID.nullable();
    expect(schema.parse(null)).toBeNull();
  });

  test('array() validates an array of UUID strings', () => {
    const schema = ZodUUID.array();
    const input = [VALID_UUID, '123e4567-e89b-12d3-a456-426614174001'];
    expect(schema.parse(input)).toEqual(input);
  });

  test('default() returns the supplied default when input is undefined', () => {
    const fallback = '123e4567-e89b-12d3-a456-426614174999';
    const schema = ZodUUID.default(fallback);
    expect(schema.parse(undefined)).toBe(fallback);
  });

  test('describe() does not change validation behaviour', () => {
    const schema = ZodUUID.describe('A UUID string');
    expect(() => schema.parse(VALID_UUID)).not.toThrow();
  });

  test('refine() enforces a custom predicate', () => {
    const schema = ZodUUID.refine((val) => val.startsWith('123'), {
      message: 'UUID must start with "123"',
    });
    expect(() => schema.parse(VALID_UUID)).not.toThrow();
    expect(() => schema.parse('456e4567-e89b-12d3-a456-426614174000')).toThrow();
  });

  // -----------------------------------------------------------------
  // 2️⃣ Edge‑case & exception tests
  // -----------------------------------------------------------------
  test('parse() throws on malformed UUID strings', () => {
    const badValues = [
      'not-a-uuid',
      '123e4567e89b12d3a456426614174000', // missing hyphens
      '123e4567-e89b-12d3-a456-42661417400', // too short
      'g23e4567-e89b-12d3-a456-426614174000', // illegal character
      '',
      12345,
      null,
      undefined,
      { foo: 'bar' },
    ];
    for (const val of badValues) {
      expect(() => ZodUUID.parse(val as any)).toThrow();
    }
  });

  test('safeParse() returns failure for malformed inputs', () => {
    const badValues = [
      '123e4567e89b12d3a456426614174000',
      '',
      42,
      null,
      undefined,
      {},
    ];
    for (const val of badValues) {
      const result = ZodUUID.safeParse(val as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_string');
      }
    }
  });

  test('optional() rejects null but accepts undefined', () => {
    const schema = ZodUUID.optional();
    expect(() => schema.parse(null as any)).toThrow();
    expect(schema.parse(undefined)).toBeUndefined();
  });

  test('nullable() rejects undefined but accepts null', () => {
    const schema = ZodUUID.nullable();
    expect(() => schema.parse(undefined as any)).toThrow();
    expect(schema.parse(null)).toBeNull();
  });

  test('array() fails when any element is not a valid UUID', () => {
    const schema = ZodUUID.array();
    const good = [VALID_UUID];
    const bad = [VALID_UUID, 'invalid-uuid'];
    expect(schema.parse(good)).toEqual(good);
    expect(() => schema.parse(bad as any)).toThrow();
    // empty array is allowed
    expect(schema.parse([])).toEqual([]);
    // non‑array input should be rejected
    expect(() => schema.parse(VALID_UUID as any)).toThrow();
  });

  test('default() throws at construction if the supplied default is not a UUID', () => {
    const badDefault = 'not-a-uuid';
    expect(() => ZodUUID.default(badDefault as any)).toThrow();
  });

  test('refine() propagates errors thrown inside the predicate as validation failures', () => {
    const schema = ZodUUID.refine(() => {
      throw new Error('boom');
    }, { message: 'Predicate exploded' });
    const result = schema.safeParse(VALID_UUID);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Predicate exploded');
    }
  });

  test('describe() stores the description on the schema', () => {
    const description = 'A UUID used for identifying resources';
    const schema = ZodUUID.describe(description);
    // Access internal definition – Zod keeps the description in `_def.description`
    // (the property is not part of the public API but is safe for test introspection)
    // @ts-expect-error – we deliberately reach into the private field for verification
    expect(schema._def.description).toBe(description);
  });
});
