/**
 * Vitest test suite for the `ZodMiniLazy` type.
 *
 * The class itself is only a thin wrapper around the internal Zod lazy
 * implementation (`core.$ZodLazy`).  Because the public API of a lazy schema
 * mirrors the regular Zod schema API, the tests focus on the behaviour that
 * is specific to the lazy nature:
 *
 * 1. Construction – the constructor must accept a lazy‑definition function.
 * 2. Normal parsing – the lazy definition is evaluated *once* per parse and
 *    the resulting schema is used to validate the input.
 * 3. Edge‑cases / error handling:
 *    - The lazy definition returns something that is **not** a Zod schema.
 *    - The lazy definition itself throws.
 *    - The lazy definition returns a schema that later throws during parsing.
 *    - Re‑using the same lazy schema with different inputs (ensuring the
 *      definition is re‑evaluated each time).
 *
 * The test file is deliberately self‑contained: it imports the public
 * `ZodMiniLazy` export, uses the real `zod` library for concrete schemas,
 * and does not rely on any internal `core` symbols.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ZodMiniLazy } from './ZodMiniLazy';

// ---------------------------------------------------------------------------
// Helper – a tiny wrapper that mimics the shape of a Zod schema returned by
// the lazy definition.  It is useful for the “non‑schema” edge case.
// ---------------------------------------------------------------------------
function notASchema(): unknown {
  return { not: 'a Zod schema' };
}

// ---------------------------------------------------------------------------
// 1️⃣  Public API extraction (for documentation purposes only)
// ---------------------------------------------------------------------------
// ZodMiniLazy is a constructor function that creates a lazy Zod schema.
// Its public “methods” are the ones inherited from the base Zod schema type,
// e.g. `parse`, `safeParse`, `refine`, etc.  In this test suite we only need
// `parse` and `safeParse` because they are sufficient to demonstrate the
// lazy behaviour and error handling.
//
// Signature (simplified):
//   ZodMiniLazy<T>(def: () => ZodType<T>): ZodType<T>
//
// Where `def` is a zero‑argument function that returns a Zod schema.
//
// ---------------------------------------------------------------------------
// 2️⃣  Basic functionality tests
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – basic functionality', () => {
  it('should parse a valid value using the lazily resolved schema', () => {
    // Lazy definition returns a simple string schema.
    const LazyString = ZodMiniLazy(() => z.string());

    // The value satisfies the inner string schema → no error.
    expect(LazyString.parse('hello world')).toBe('hello world');
  });

  it('should reject an invalid value according to the lazily resolved schema', () => {
    const LazyNumber = ZodMiniLazy(() => z.number());

    // Parsing a non‑number should throw a ZodError.
    expect(() => LazyNumber.parse('not a number')).toThrowError();
  });

  it('safeParse should return a success result for valid data', () => {
    const LazyBool = ZodMiniLazy(() => z.boolean());

    const result = LazyBool.safeParse(true);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(true);
    }
  });

  it('safeParse should return a failure result for invalid data', () => {
    const LazyBool = ZodMiniLazy(() => z.boolean());

    const result = LazyBool.safeParse('true');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Expected boolean');
    }
  });
});

// ---------------------------------------------------------------------------
// 3️⃣  Edge‑case & exception handling tests
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – edge cases & error handling', () => {
  it('should throw if the lazy definition returns a non‑Zod schema', () => {
    // The lazy function returns a plain object, not a Zod schema.
    const BadLazy = ZodMiniLazy(notASchema as unknown as () => any);

    // Any attempt to parse should result in a runtime error because the
    // internal implementation expects a Zod schema with a `_parse` method.
    expect(() => BadLazy.parse('anything')).toThrowError(
      /must be a Zod schema/i,
    );
  });

  it('should propagate errors thrown inside the lazy definition', () => {
    const explodingLazy = ZodMiniLazy(() => {
      throw new Error('Lazy definition exploded');
    });

    expect(() => explodingLazy.parse('whatever')).toThrowError(
      /Lazy definition exploded/,
    );
  });

  it('should re‑evaluate the lazy definition on each parse call', () => {
    // Counter to verify that the definition function runs each time.
    let callCount = 0;
    const CounterLazy = ZodMiniLazy(() => {
      callCount += 1;
      // Alternate between string and number schemas based on call count.
      return callCount % 2 === 0 ? z.number() : z.string();
    });

    // First parse → string schema.
    expect(CounterLazy.parse('first')).toBe('first');
    expect(callCount).toBe(1);

    // Second parse → number schema (will throw because we pass a string).
    expect(() => CounterLazy.parse('second')).toThrowError();
    expect(callCount).toBe(2);

    // Third parse → string schema again, this time with a valid string.
    expect(CounterLazy.parse('third')).toBe('third');
    expect(callCount).toBe(3);
  });

  it('should handle circular lazy definitions without immediate stack overflow', () => {
    // A classic recursive schema: a node that contains an array of itself.
    type Node = { children: Node[] };
    const NodeSchema = ZodMiniLazy<Node>(() => z.object({
      children: z.array(NodeSchema),
    }));

    // A simple, non‑recursive instance should parse successfully.
    const simpleNode = { children: [] };
    expect(NodeSchema.parse(simpleNode)).toEqual(simpleNode);

    // A deeper recursive instance.
    const deepNode = { children: [{ children: [] }] };
    expect(NodeSchema.parse(deepNode)).toEqual(deepNode);
  });
});

// ---------------------------------------------------------------------------
// 4️⃣  Full integration test – combining typical usage with edge cases
// ---------------------------------------------------------------------------
describe('ZodMiniLazy – integration scenarios', () => {
  it('should work with refinements added after lazy creation', () => {
    const LazyEmail = ZodMiniLazy(() => z.string().email());

    // Add a custom refinement that disallows a specific domain.
    const Refined = LazyEmail.refine((val) => !val.endsWith('@spam.com'), {
      message: 'Spam domains are not allowed',
    });

    // Valid email passes.
    expect(Refined.parse('user@example.com')).toBe('user@example.com');

    // Invalid email format throws.
    expect(() => Refined.parse('not-an-email')).toThrowError();

    // Disallowed domain throws with the custom message.
    expect(() => Refined.parse('bad@spam.com')).toThrowError(
      /Spam domains are not allowed/,
    );
  });
});
