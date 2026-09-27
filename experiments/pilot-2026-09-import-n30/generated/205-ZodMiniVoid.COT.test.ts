import { describe, it, expect } from 'vitest';
import { ZodMiniVoid } from './schemas.js';

// Helper to create a fresh instance for each test
function createVoidSchema() {
  // ZodMiniVoid is a constructor created by core.$constructor, so we can instantiate it with `new`
  // (If the actual library uses a factory function, replace `new ZodMiniVoid()` with `ZodMiniVoid()`.)
  return new ZodMiniVoid();
}

describe('ZodMiniVoid – core functionality', () => {
  it('should parse undefined (the only valid value) without error', () => {
    const schema = createVoidSchema();
    const result = schema.parse(undefined);
    expect(result).toBeUndefined();
  });

  it('should treat missing argument as undefined and succeed', () => {
    const schema = createVoidSchema();
    // @ts-expect-error – calling without argument is allowed at runtime
    const result = schema.parse();
    expect(result).toBeUndefined();
  });

  it('should throw when parsing any non‑undefined value', () => {
    const schema = createVoidSchema();
    const invalidValues = [null, 0, 1, '', 'text', {}, [], true, false, Symbol('s')];

    for (const val of invalidValues) {
      expect(() => schema.parse(val)).toThrowError();
    }
  });

  it('safeParse should succeed for undefined', () => {
    const schema = createVoidSchema();
    const res = schema.safeParse(undefined);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBeUndefined();
    }
  });

  it('safeParse should treat missing argument as undefined and succeed', () => {
    const schema = createVoidSchema();
    // @ts-expect-error – calling without argument is allowed at runtime
    const res = schema.safeParse();
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBeUndefined();
    }
  });

  it('safeParse should fail for any non‑undefined value', () => {
    const schema = createVoidSchema();
    const invalidValues = [null, 0, 1, '', 'text', {}, [], true, false, Symbol('s')];

    for (const val of invalidValues) {
      const res = schema.safeParse(val);
      expect(res.success).toBe(false);
      // The error object shape is not part of the public contract, but we ensure it exists
      if (!res.success) {
        expect(res.error).toBeDefined();
      }
    }
  });
});

describe('ZodMiniVoid – edge cases & method chaining', () => {
  it('optional() should still accept undefined and also treat undefined as present', () => {
    const schema = createVoidSchema().optional();
    // parse undefined – still valid
    expect(schema.parse(undefined)).toBeUndefined();

    // parse missing argument – also valid (treated as undefined)
    // @ts-expect-error
    expect(schema.parse()).toBeUndefined();
  });

  it('nullable() should accept null in addition to undefined', () => {
    const schema = createVoidSchema().nullable();

    // undefined is still valid
    expect(schema.parse(undefined)).toBeUndefined();

    // null becomes valid after .nullable()
    expect(schema.parse(null)).toBeNull();

    // any other value should still throw
    expect(() => schema.parse(0)).toThrowError();
  });

  it('default(undefined) should behave like the original schema (still only undefined)', () => {
    const schema = createVoidSchema().default(undefined);

    // parse undefined – succeeds
    expect(schema.parse(undefined)).toBeUndefined();

    // parse missing argument – should use the default (undefined) and succeed
    // @ts-expect-error
    expect(schema.parse()).toBeUndefined();

    // any other value still errors
    expect(() => schema.parse('not void')).toThrowError();
  });

  it('check() should return true only for undefined', () => {
    const schema = createVoidSchema();

    // valid
    expect(schema.check(undefined)).toBe(true);
    // missing argument (treated as undefined)
    // @ts-expect-error
    expect(schema.check()).toBe(true);

    // invalid values
    const invalidValues = [null, 0, 1, '', 'text', {}, [], true, false];
    for (const val of invalidValues) {
      expect(schema.check(val)).toBe(false);
    }
  });
});
