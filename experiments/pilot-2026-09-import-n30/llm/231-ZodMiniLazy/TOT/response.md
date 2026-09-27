###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniLazy` class.
 *
 * The tests cover:
 * 1. Basic lazy evaluation – the schema is not evaluated until parsing.
 * 2. Correct parsing of valid data and proper rejection of invalid data.
 * 3. Recursive (self‑referential) schemas to ensure lazy resolution works for circular types.
 * 4. Edge cases where the lazy factory throws or returns an invalid schema.
 * 5. Verification that the factory function is called exactly once per parse operation.
 *
 * The test file assumes that the underlying Zod core library is available
 * (e.g. `core.$ZodNumber`, `core.$ZodString`, etc.) and that those types are
 * re‑exported from the `zod` package for convenience.
 */

import { describe, it, expect, vi } from 'vitest';
import { ZodMiniLazy } from './schemas.js';
import {
  ZodNumber,
  ZodString,
  ZodObject,
  ZodArray,
  ZodTypeAny,
  ZodError,
} from 'zod'; // re‑exports from the core Zod library

/**
 * Helper to create a ZodMiniLazy schema from a factory returning a Zod type.
 * The factory is typed as `() => ZodTypeAny` to keep the tests simple.
 */
function lazy<T extends ZodTypeAny>(factory: () => T) {
  // The actual `ZodMiniLazy` constructor expects the same signature as Zod's lazy.
  // We simply forward the factory.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – the core constructor typing is opaque for the test.
  return ZodMiniLazy(factory);
}

describe('ZodMiniLazy – basic lazy evaluation', () => {
  it('does not invoke the factory at definition time', () => {
    const factory = vi.fn(() => ZodNumber());
    const schema = lazy(factory);

    // At this point the factory must not have been called.
    expect(factory).not.toHaveBeenCalled();

    // Parsing a valid number triggers the factory exactly once.
    const result = schema.parse(42);
    expect(result).toBe(42);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('parses valid data and rejects invalid data', () => {
    const schema = lazy(() => ZodString());

    // Valid string passes.
    expect(schema.parse('hello')).toBe('hello');

    // Invalid number throws a ZodError.
    expect(() => schema.parse(123)).toThrowError(ZodError);
  });
});

describe('ZodMiniLazy – recursive schemas', () => {
  /**
   * A simple recursive tree node:
   *   { value: number, children?: Node[] }
   */
  const Node = lazy(() =>
    ZodObject({
      value: ZodNumber(),
      // `Node` is referenced lazily to break the circular dependency.
      children: ZodArray(Node).optional(),
    })
  );

  it('parses a shallow node correctly', () => {
    const data = { value: 1 };
    expect(Node.parse(data)).toEqual(data);
  });

  it('parses a deep nested node structure', () => {
    const data = {
      value: 1,
      children: [
        { value: 2 },
        {
          value: 3,
          children: [{ value: 4 }],
        },
      ],
    };
    expect(Node.parse(data)).toEqual(data);
  });

  it('rejects malformed recursive structures', () => {
    const badData = {
      value: 1,
      children: [{ value: 'not-a-number' }], // value should be a number
    };
    expect(() => Node.parse(badData)).toThrowError(ZodError);
  });
});

describe('ZodMiniLazy – error handling in the factory', () => {
  it('propagates errors thrown by the factory', () => {
    const errorMessage = 'Factory failure';
    const factory = vi.fn(() => {
      throw new Error(errorMessage);
    });
    const schema = lazy(factory);

    expect(() => schema.parse('anything')).toThrowError(errorMessage);
    // The factory should have been called exactly once during the parse attempt.
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('throws if the factory returns a non‑Zod schema', () => {
    // @ts-ignore – intentionally returning a wrong type.
    const schema = lazy(() => ({ not: 'a Zod schema' }));

    // Zod's lazy implementation validates the return value at parse time.
    expect(() => schema.parse('test')).toThrowError();
  });
});

describe('ZodMiniLazy – multiple parses and caching behavior', () => {
  it('calls the factory on each parse (no internal caching)', () => {
    const factory = vi.fn(() => ZodNumber());
    const schema = lazy(factory);

    // First parse – factory called once.
    expect(schema.parse(10)).toBe(10);
    expect(factory).toHaveBeenCalledTimes(1);

    // Second parse – factory called again (Zod's lazy does not cache the schema).
    expect(schema.parse(20)).toBe(20);
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
```
###Test END##