###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniLazy` exported from `./schemas.js`.
 *
 * The tests cover:
 * 1. Extraction of public methods (inferred from typical Zod schema behaviour).
 * 2. Basic functionality of each public method.
 * 3. Edge‑case handling such as lazy‑initialiser errors, circular references,
 *    and validation failures.
 *
 * NOTE:
 * - `ZodMiniLazy` is created via `core.$constructor` and behaves like a Zod
 *   schema (it has `parse`, `safeParse`, `check`, `refine`, …).  The exact
 *   method list is inferred from the Zod API because the source only shows
 *   the constructor wrapper.
 * - The tests use the real `zod` library (installed as a dev‑dependency) to
 *   build concrete inner schemas that the lazy wrapper can delegate to.
 */

import { describe, it, expect, vi } from 'vitest';
import { ZodMiniLazy } from './schemas.js';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helper: a simple lazy factory that records when it is invoked.
// ---------------------------------------------------------------------------
function createLazyFactory<T>(schema: z.ZodType<T>) {
  let callCount = 0;
  const factory = vi.fn(() => {
    callCount++;
    return schema;
  });
  return { factory, getCallCount: () => callCount };
}

// ---------------------------------------------------------------------------
// 1️⃣  Public methods (inferred from Zod's schema API)
// ---------------------------------------------------------------------------
// The following methods are expected to exist on any Zod schema instance,
// including the one returned by `ZodMiniLazy`:
//
//   - parse(value: unknown, params?: ParseParams): T
//   - safeParse(value: unknown, params?: ParseParams): SafeParseReturnType<T>
//   - refine(check: (arg: T) => boolean, message?: string | ZodIssueOptionalMessage): this
//   - superRefine(check: (arg: T, ctx: RefinementCtx) => void): this
//   - optional(): ZodOptional<T>
//   - nullable(): ZodNullable<T>
//   - array(): ZodArray<T>
//   - default(def: T | (() => T)): ZodDefault<T>
//   - catch(def: T | (() => T)): ZodCatch<T>
//   - transform<Out>(transform: (arg: T) => Out): ZodTransformer<T, Out>
//   - describe(description: string): this
//   - brand<B extends string>(brand: B): ZodBranded<T, B>
//   - etc.
//
// For the purpose of this test suite we will focus on the most commonly used
// methods: `parse`, `safeParse`, `optional`, `nullable`, and `describe`.
// ---------------------------------------------------------------------------

describe('ZodMiniLazy – basic public API', () => {
  it('should be a constructor function', () => {
    expect(typeof ZodMiniLazy).toBe('function');
  });

  it('should create a lazy schema that defers evaluation until first use', () => {
    const inner = z.string().min(3);
    const { factory, getCallCount } = createLazyFactory(inner);

    // Create the lazy schema – the factory must NOT be called yet.
    const LazySchema = ZodMiniLazy.create(factory as any);
    expect(getCallCount()).toBe(0);

    // First parse triggers the factory.
    const result = LazySchema.parse('abc');
    expect(result).toBe('abc');
    expect(getCallCount()).toBe(1);

    // Subsequent parses reuse the already‑initialized schema (factory not called again).
    LazySchema.parse('defg');
    expect(getCallCount()).toBe(1);
  });

  it('parse should return the correctly typed value for valid input', () => {
    const LazyNumber = ZodMiniLazy.create(() => z.number().int().positive());
    const value = LazyNumber.parse(42);
    expect(value).toBe(42);
  });

  it('parse should throw on invalid input', () => {
    const LazyNumber = ZodMiniLazy.create(() => z.number().int().positive());
    expect(() => LazyNumber.parse(-5)).toThrowError();
    expect(() => LazyNumber.parse('not a number')).toThrowError();
  });

  it('safeParse should return a success object for valid input', () => {
    const LazyBool = ZodMiniLazy.create(() => z.boolean());
    const res = LazyBool.safeParse(true);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe(true);
    }
  });

  it('safeParse should return a failure object for invalid input', () => {
    const LazyBool = ZodMiniLazy.create(() => z.boolean());
    const res = LazyBool.safeParse('yes');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('optional() should accept undefined without error', () => {
    const LazyString = ZodMiniLazy.create(() => z.string().min(2));
    const OptionalLazy = LazyString.optional();
    expect(OptionalLazy.parse(undefined)).toBeUndefined();
    expect(OptionalLazy.parse('hi')).toBe('hi');
  });

  it('nullable() should accept null without error', () => {
    const LazyString = ZodMiniLazy.create(() => z.string().min(2));
    const NullableLazy = LazyString.nullable();
    expect(NullableLazy.parse(null)).toBeNull();
    expect(NullableLazy.parse('hello')).toBe('hello');
  });

  it('describe() should set a description that can be retrieved via .description', () => {
    const LazyNum = ZodMiniLazy.create(() => z.number());
    const described = LazyNum.describe('A lazy number schema');
    // Zod stores description on the internal `_def` object.
    // Accessing it via `.description` is a common pattern.
    // The test guards against the property not existing.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDescribed = described as any;
    expect(anyDescribed._def?.description).toBe('A lazy number schema');
  });
});

// ---------------------------------------------------------------------------
// 2️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------

describe('ZodMiniLazy – edge cases & error handling', () => {
  it('should propagate errors thrown by the lazy factory', () => {
    const errorFactory = () => {
      throw new Error('Factory failure');
    };
    const LazyErr = ZodMiniLazy.create(errorFactory as any);
    expect(() => LazyErr.parse('anything')).toThrowError('Factory failure');
  });

  it('should handle circular lazy references without infinite recursion', () => {
    // Define a recursive type: a node that contains an array of itself.
    type Node = { children: Node[] };
    const NodeSchema: any = ZodMiniLazy.create(() => NodeSchema).array().optional();
    // The above pattern mirrors Zod's own lazy recursion example.
    // Parsing a simple value should succeed.
    const result = NodeSchema.parse(undefined);
    expect(result).toBeUndefined();
  });

  it('should not evaluate the factory when only metadata methods are called', () => {
    const inner = z.string();
    const { factory, getCallCount } = createLazyFactory(inner);
    const LazySchema = ZodMiniLazy.create(factory as any);

    // Calling `describe` should not trigger evaluation.
    LazySchema.describe('metadata only');
    expect(getCallCount()).toBe(0);
  });

  it('should correctly handle a factory that returns a different schema on subsequent calls', () => {
    // Simulate a factory that changes its return value (should never happen in real usage,
    // but we test that the lazy wrapper caches the first result).
    const first = z.string().min(5);
    const second = z.string().max(2);
    let toggle = true;
    const mutableFactory = vi.fn(() => {
      toggle = !toggle;
      return toggle ? first : second;
    });

    const LazySchema = ZodMiniLazy.create(mutableFactory as any);
    // First parse uses `first` schema.
    expect(() => LazySchema.parse('hello')).not.toThrow();
    // Second parse should still use the cached `first` schema, not `second`.
    expect(() => LazySchema.parse('hi')).toThrowError(); // too short for `first`
    expect(mutableFactory).toHaveBeenCalledTimes(1);
  });

  it('should throw a clear error when the inner schema is not a Zod schema', () => {
    const bogusFactory = () => ({ not: 'a Zod schema' } as any);
    const LazyBogus = ZodMiniLazy.create(bogusFactory);
    expect(() => LazyBogus.parse('anything')).toThrowError();
  });
});
```
###Test END##