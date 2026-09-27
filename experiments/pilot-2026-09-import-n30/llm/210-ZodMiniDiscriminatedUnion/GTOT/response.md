###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniDiscriminatedUnion` exported from `./schemas.js`.
 *
 * The tests cover:
 * 1. Public API surface (method signatures).
 * 2. Basic functional behaviour (happy‑path parsing).
 * 3. Edge‑cases and error handling (invalid definitions, wrong discriminant values, etc.).
 *
 * NOTE:
 * - The actual implementation of the underlying Zod‑mini core is not part of this repository,
 *   therefore the tests focus on the contract that `ZodMiniDiscriminatedUnion` promises
 *   (i.e. it should be a constructor that returns an object exposing the typical Zod
 *   discriminated‑union methods such as `parse`, `safeParse`, `refine`, …).
 * - If the library adds or removes public methods in the future, the “method‑signature” test
 *   will fail, prompting an update of the test suite.
 */

import { describe, it, expect } from 'vitest';
import { ZodMiniDiscriminatedUnion } from './schemas.js';

// ---------------------------------------------------------------------------
// 1️⃣  Extract & list public methods (including signatures)
// ---------------------------------------------------------------------------
// The public API of a Zod discriminated‑union instance is expected to contain
// at least the following methods (mirroring the real Zod API).  The test below
// asserts that each method exists and has the correct type signature (as far
// as TypeScript can infer at runtime).
type ExpectedMethods = {
  parse: (value: unknown) => any;
  safeParse: (value: unknown) => { success: boolean; data?: any; error?: any };
  refine: (check: (val: any) => boolean, message?: string) => any;
  superRefine: (check: (val: any, ctx: any) => void) => any;
  optional: () => any;
  nullable: () => any;
  array: () => any;
  catch: (def: any) => any;
};

function assertMethodSignatures(instance: any) {
  // Helper that throws a clear error if a method is missing or not a function.
  const missing: string[] = [];
  (Object.keys(
    {
      parse: null,
      safeParse: null,
      refine: null,
      superRefine: null,
      optional: null,
      nullable: null,
      array: null,
      catch: null,
    } as ExpectedMethods
  ) as (keyof ExpectedMethods)[]).forEach((key) => {
    if (typeof instance[key] !== 'function') {
      missing.push(key);
    }
  });
  if (missing.length) {
    throw new Error(
      `ZodMiniDiscriminatedUnion instance is missing expected methods: ${missing.join(
        ', '
      )}`
    );
  }
}

// ---------------------------------------------------------------------------
// 2️⃣  Helper – create a minimal valid discriminated‑union definition
// ---------------------------------------------------------------------------
// The real `core.$ZodDiscriminatedUnion.init` expects a definition object that
// contains a `discriminator` key and an array of variant schemas.  For the purpose
// of these tests we can supply a very small mock that satisfies the runtime
// checks performed by the library (the library only inspects the shape, not the
// actual Zod schema constructors).
function makeValidDefinition() {
  // Two simple variant schemas – each is a plain object with a `type` literal.
  const VariantA = {
    // In a real Zod schema this would be something like `z.object({ type: z.literal('a'), value: z.string() })`
    _def: { typeName: 'ZodMiniObject', shape: { type: { _def: { typeName: 'ZodMiniLiteral', value: 'a' } } } },
    parse: (v: any) => v,
    safeParse: (v: any) => ({ success: true, data: v }),
  };
  const VariantB = {
    _def: { typeName: 'ZodMiniObject', shape: { type: { _def: { typeName: 'ZodMiniLiteral', value: 'b' } } } },
    parse: (v: any) => v,
    safeParse: (v: any) => ({ success: true, data: v }),
  };

  return {
    discriminator: 'type',
    variants: [VariantA, VariantB],
  };
}

// ---------------------------------------------------------------------------
// 3️⃣  Basic (happy‑path) test cases
// ---------------------------------------------------------------------------
describe('ZodMiniDiscriminatedUnion – public API & basic behaviour', () => {
  const definition = makeValidDefinition();

  // The constructor is a function (core.$constructor returns a callable)
  it('should be a callable constructor', () => {
    expect(typeof ZodMiniDiscriminatedUnion).toBe('function');
  });

  // Instantiation with a valid definition should succeed and expose the expected methods.
  it('should instantiate without throwing and expose expected methods', () => {
    const instance = new (ZodMiniDiscriminatedUnion as any)(definition);
    // The instance should contain the internal `_zod` property (as declared in the interface)
    expect('_zod' in instance).toBe(true);
    // Verify method signatures
    expect(() => assertMethodSignatures(instance)).not.toThrow();
  });

  // Happy‑path parsing – a value that matches one of the variants.
  it('should correctly parse a valid discriminated object (variant A)', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(definition);
    const input = { type: 'a', value: 'hello' };
    const output = schema.parse(input);
    expect(output).toEqual(input);
  });

  it('should correctly parse a valid discriminated object (variant B)', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(definition);
    const input = { type: 'b', count: 42 };
    const output = schema.parse(input);
    expect(output).toEqual(input);
  });

  // safeParse should return a success result for valid inputs.
  it('safeParse should succeed for a valid object', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(definition);
    const result = schema.safeParse({ type: 'a', foo: 'bar' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ type: 'a', foo: 'bar' });
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Edge‑cases & exception handling
// ---------------------------------------------------------------------------
describe('ZodMiniDiscriminatedUnion – edge cases & error scenarios', () => {
  // 4.1 Invalid definition (missing discriminator)
  it('should throw when instantiated with a definition missing the discriminator key', () => {
    const badDef = { variants: [] }; // no `discriminator`
    // The constructor is expected to validate the definition and throw.
    expect(() => new (ZodMiniDiscriminatedUnion as any)(badDef)).toThrowError();
  });

  // 4.2 Invalid definition (empty variants array)
  it('should throw when instantiated with an empty variants array', () => {
    const badDef = { discriminator: 'type', variants: [] };
    expect(() => new (ZodMiniDiscriminatedUnion as any)(badDef)).toThrowError();
  });

  // 4.3 Parsing a value with a missing discriminant property
  it('should throw on parse when discriminant property is absent', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition());
    const input = { value: 'no type here' };
    expect(() => schema.parse(input)).toThrowError();
  });

  // 4.4 Parsing a value with an unknown discriminant value
  it('should throw on parse when discriminant value does not match any variant', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition());
    const input = { type: 'c', extra: true }; // 'c' is not defined
    expect(() => schema.parse(input)).toThrowError();
  });

  // 4.5 safeParse should return a failure object for invalid inputs
  it('safeParse should return failure for unknown discriminant', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition());
    const result = schema.safeParse({ type: 'unknown' });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  // 4.6 Passing `null` or `undefined` to parse should result in an error
  it.each([null, undefined])('parse should throw when given %p', (value) => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition());
    expect(() => schema.parse(value)).toThrowError();
  });

  // 4.7 Using `optional()` should allow `undefined` without throwing
  it('optional() should accept undefined without error', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition()).optional();
    expect(() => schema.parse(undefined)).not.toThrow();
    // When defined, it should still validate correctly.
    expect(() => schema.parse({ type: 'a' })).not.toThrow();
  });

  // 4.8 Using `nullable()` should accept `null` without throwing
  it('nullable() should accept null without error', () => {
    const schema = new (ZodMiniDiscriminatedUnion as any)(makeValidDefinition()).nullable();
    expect(() => schema.parse(null)).not.toThrow();
    // Normal validation still works for non‑null values.
    expect(() => schema.parse({ type: 'b' })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 5️⃣  Comprehensive test file export (no default export needed)
// ---------------------------------------------------------------------------
export {};
```
###Test END##