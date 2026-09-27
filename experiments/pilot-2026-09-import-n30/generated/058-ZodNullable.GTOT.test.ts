import { describe, it, expect } from 'vitest';
import { ZodNullable } from './schemas.js';

/**
 * The public API of `ZodNullable` consists of a single method:
 *   - unwrap(): T
 *
 * The constructor returned by `core.$constructor` creates a schema instance
 * that stores the provided inner type in `inst._zod.def.innerType`.  
 * The `unwrap` method simply returns that stored value.
 *
 * The tests below cover:
 *   1. Normal usage – the inner type is returned unchanged.
 *   2. Edge‑case inputs (undefined, null) – the method should return whatever
 *      was stored without throwing.
 *   3. Idempotence – multiple calls return the exact same reference.
 *   4. Reference semantics – the returned value is the original object,
 *      not a copy (mutating it affects the original).
 */

describe('ZodNullable', () => {
  /** Basic functionality – returns the inner type that was supplied to the constructor */
  it('unwrap should return the inner type passed to the constructor', () => {
    const inner = { _zod: { def: {} } } as any; // a minimal mock of a Zod type
    const schema = ZodNullable(inner);
    expect(schema.unwrap()).toBe(inner);
  });

  /** Edge case – inner type is `undefined` */
  it('unwrap should return undefined when the inner type is undefined', () => {
    const schema = ZodNullable(undefined as any);
    expect(schema.unwrap()).toBeUndefined();
  });

  /** Edge case – inner type is `null` */
  it('unwrap should return null when the inner type is null', () => {
    const schema = ZodNullable(null as any);
    expect(schema.unwrap()).toBeNull();
  });

  /** Idempotence – multiple calls return the same reference */
  it('multiple calls to unwrap should return the same reference', () => {
    const inner = { _zod: { def: {} } } as any;
    const schema = ZodNullable(inner);
    const first = schema.unwrap();
    const second = schema.unwrap();

    expect(first).toBe(inner);
    expect(second).toBe(inner);
    expect(first).toBe(second);
  });

  /** Reference semantics – the returned value is not a copy */
  it('should return the actual inner type reference (mutating it affects the original)', () => {
    const inner = { mutable: true } as any;
    const schema = ZodNullable(inner);
    const returned = schema.unwrap();

    // Mutate the returned object
    (returned as any).mutable = false;

    // The original mock should reflect the mutation, proving that unwrap returns the original reference
    expect(inner.mutable).toBe(false);
  });
});
