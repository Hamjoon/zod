import { describe, expect, test } from 'vitest';
import { ZodMiniIntersection } from './schemas.js';

/* -------------------------------------------------------------------------
   Helper utilities used only inside the test file
-------------------------------------------------------------------------- */
// a tiny mock Zod‑like schema that validates a literal value
function literalSchema<T extends string | number | boolean>(expected: T) {
  return {
    parse(value: unknown) {
      if (value !== expected) {
        throw new Error(`Expected literal ${expected}`);
      }
      return value as T;
    },
    safeParse(value: unknown) {
      try {
        return { success: true, data: this.parse(value) };
      } catch (e) {
        return { success: false, error: e };
      }
    },
  } as any;
}

// builds a minimal, *valid* intersection definition object
function makeValidDef<A, B>(left: any, right: any) {
  return {
    left,
    right,
    typeName: 'ZodIntersection' as const,
  } as unknown as core.$ZodIntersectionInternals<A, B>;
}

/* -------------------------------------------------------------------------
   1️⃣  Constructor basic sanity checks
-------------------------------------------------------------------------- */
describe('ZodMiniIntersection – constructor basics', () => {
  test('can be instantiated with a minimal valid definition', () => {
    const def = makeValidDef(literalSchema(1), literalSchema(2));
    const Intersection = ZodMiniIntersection;
    const schema = new Intersection(def);

    expect(schema).toBeTruthy();
    // inherited public API – at least `parse` must exist
    expect(typeof (schema as any).parse).toBe('function');
  });
});

/* -------------------------------------------------------------------------
   2️⃣  Edge‑case / exception handling for the constructor
-------------------------------------------------------------------------- */
describe('ZodMiniIntersection – constructor edge cases', () => {
  test('throws when definition is undefined', () => {
    const Intersection = ZodMiniIntersection;
    // @ts-expect-error – deliberately wrong argument
    expect(() => new Intersection(undefined)).toThrowError();
  });

  test('throws when definition is null', () => {
    const Intersection = ZodMiniIntersection;
    // @ts-expect-error – deliberately wrong argument
    expect(() => new Intersection(null)).toThrowError();
  });

  test('throws when required fields are missing', () => {
    const badDef = {} as any;
    const Intersection = ZodMiniIntersection;
    expect(() => new Intersection(badDef)).toThrowError();
  });

  test('throws when left/right are not Zod‑like objects', () => {
    const badDef = { left: 123, right: 'abc', typeName: 'ZodIntersection' } as any;
    const Intersection = ZodMiniIntersection;
    expect(() => new Intersection(badDef)).toThrowError();
  });
});

/* -------------------------------------------------------------------------
   3️⃣  Behaviour of inherited parsing methods (parse / safeParse)
-------------------------------------------------------------------------- */
describe('ZodMiniIntersection – inherited parsing behaviour', () => {
  // two schemas that accept *different* literals – intersection should reject both
  const leftSchema = literalSchema(42);
  const rightSchema = literalSchema('ok');

  const def = makeValidDef(leftSchema, rightSchema);
  const Intersection = ZodMiniIntersection;
  const schema = new Intersection(def);

  test('parse fails when value satisfies only the left side', () => {
    expect(() => (schema as any).parse(42)).toThrowError();
  });

  test('parse fails when value satisfies only the right side', () => {
    expect(() => (schema as any).parse('ok')).toThrowError();
  });

  test('parse succeeds only when value satisfies both sides', () => {
    // create a realistic intersection where both sides accept the same value
    const shared = literalSchema('shared');
    const sharedDef = makeValidDef(shared, shared);
    const sharedSchema = new Intersection(sharedDef);

    expect((sharedSchema as any).parse('shared')).toBe('shared');
  });

  test('safeParse returns a success flag and data when validation passes', () => {
    const left = literalSchema('x');
    const right = literalSchema('x');
    const okDef = makeValidDef(left, right);
    const okSchema = new Intersection(okDef);

    const result = (okSchema as any).safeParse('x');
    expect(result.success).toBe(true);
    expect(result.data).toBe('x');
  });

  test('safeParse returns a failure flag and error when validation fails', () => {
    const left = literalSchema('x');
    const right = literalSchema('x');
    const okDef = makeValidDef(left, right);
    const okSchema = new Intersection(okDef);

    const result = (okSchema as any).safeParse('y');
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });
});
