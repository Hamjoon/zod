import { describe, it, expect } from 'vitest';
import { ZodNull } from './schemas.js';
import type { ZodError } from 'zod';

// Helper to create a fresh schema instance
const createSchema = () => ZodNull();

describe('ZodNull schema', () => {
  // -----------------------------------------------------------------
  // 1. Basic successful parsing (happy path)
  // -----------------------------------------------------------------
  it('should parse null and return null', () => {
    const schema = createSchema();
    const result = schema.parse(null);
    expect(result).toBeNull();
  });

  // -----------------------------------------------------------------
  // 2. parse() error handling – non‑null values
  // -----------------------------------------------------------------
  const invalidValues = [
    undefined,
    0,
    123,
    '',
    'string',
    true,
    false,
    {},
    { a: 1 },
    [],
    [null],
    NaN,
    Symbol('sym'),
    () => {},
  ];

  invalidValues.forEach((val) => {
    it(`should throw ZodError when parsing ${String(val)} (${typeof val})`, () => {
      const schema = createSchema();
      expect(() => schema.parse(val as any)).toThrowError(ZodError);
      try {
        schema.parse(val as any);
      } catch (e) {
        const err = e as ZodError;
        // The default Zod error message for null is “Expected null, received …”
        expect(err.errors[0].message).toContain('Expected null');
      }
    });
  });

  // -----------------------------------------------------------------
  // 3. safeParse() – success and failure branches
  // -----------------------------------------------------------------
  it('safeParse(null) should succeed', () => {
    const schema = createSchema();
    const result = schema.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeNull();
    }
  });

  it('safeParse(undefined) should fail with proper error shape', () => {
    const schema = createSchema();
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      // ZodError shape
      expect(result.error).toBeInstanceOf(ZodError);
      expect(result.error.errors[0].message).toContain('Expected null');
    }
  });

  // -----------------------------------------------------------------
  // 4. Type hierarchy – instance checks
  // -----------------------------------------------------------------
  it('instance should be a ZodType', () => {
    const schema = createSchema();
    // ZodType is the base class; we can check via instanceof if it is exported.
    // Since we only have the runtime object, we rely on the presence of ._def.typeName.
    expect(schema._def.typeName).toBe('ZodNull');
  });

  // -----------------------------------------------------------------
  // 5. Edge case – cloning / .optional() behavior (ensuring it still rejects non‑null)
  // -----------------------------------------------------------------
  it('optional() should allow undefined but still reject non‑null', () => {
    const schema = createSchema().optional();
    // undefined is now allowed
    expect(schema.safeParse(undefined).success).toBe(true);
    // null is still valid
    expect(schema.safeParse(null).success).toBe(true);
    // any other value must fail
    const fail = schema.safeParse(0);
    expect(fail.success).toBe(false);
    if (!fail.success) {
      expect(fail.error.errors[0].message).toContain('Expected null');
    }
  });
});
