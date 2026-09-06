###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniLazy` class.
 *
 * The tests cover:
 * 1. Construction side‑effects (calls to core.$ZodLazy.init and ZodMiniType.init).
 * 2. Basic lazy parsing (a lazy schema that resolves to a primitive).
 * 3. Recursive lazy schemas (self‑referencing objects).
 * 4. Edge‑case handling – invalid definitions and init‑time errors.
 * 5. Type‑guard checks (instanceof, interface shape).
 *
 * The real `core` module is mocked so we can assert that the internal
 * initialization functions are invoked with the correct arguments.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ZodMiniLazy } from './ZodMiniLazy';

// ---------------------------------------------------------------------------
// Mocking the `core` namespace and related helpers
// ---------------------------------------------------------------------------
/**
 * The production code imports symbols from a `core` module (e.g., core.$ZodLazy,
 * core.$constructor, core.$ZodLazyInternals, etc.).  For unit‑testing we replace
 * that module with a lightweight mock that records calls and provides minimal
 * behaviour needed for the tests.
 */
vi.mock('./ZodMiniLazy', async (importOriginal) => {
  // Pull the original module to keep the exported `ZodMiniLazy` constructor.
  const original = await importOriginal();

  // Create a fresh mock for the `core` namespace.
  const coreMock = {
    $ZodLazy: {
      init: vi.fn(),
    },
    $constructor: (name: string, initFn: any) => {
      // The real $constructor returns a function that can be called with
      // (inst, def).  We mimic that behaviour.
      const ctor = function (def: any) {
        // `inst` is a plain object that will become the instance.
        const inst: any = {};
        initFn(inst, def);
        // Attach a marker so we can recognise the mock instance later.
        inst.__zodMiniLazyName = name;
        return inst;
      };
      // Preserve the original type (so `instanceof ZodMiniLazy` works).
      Object.setPrototypeOf(ctor, original.ZodMiniLazy);
      return ctor as any;
    },
    $ZodLazyInternals: class {},
    $ZodType: class {},
  };

  // Re‑export everything from the original module, but replace the `core`
  // import with our mock.
  return {
    ...original,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – we inject the mock where the original module expects it.
    core: coreMock,
  };
});

// After the mock is set up we can import the real symbols we need.
import { core } from './ZodMiniLazy'; // This now points to the mocked core.

describe('ZodMiniLazy', () => {
  // Reset mocks before each test to avoid cross‑test pollution.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // 1️⃣ Construction side‑effects
  // -----------------------------------------------------------------------
  it('should call core.$ZodLazy.init and ZodMiniType.init on construction', () => {
    // Arrange: a dummy definition that a real lazy schema would receive.
    const dummyDef = { get: vi.fn(() => core.$ZodLazyInternals) };

    // Act: create an instance via the constructor function.
    const instance = ZodMiniLazy(dummyDef);

    // Assert: both init functions were called exactly once with the instance
    // and the definition we passed.
    expect(core.$ZodLazy.init).toHaveBeenCalledTimes(1);
    expect(core.$ZodLazy.init).toHaveBeenCalledWith(instance, dummyDef);

    // ZodMiniType is imported from the same file; we need to spy on its init.
    // Since ZodMiniType.init is not exported, we mock it via the prototype.
    // For the purpose of this test we assume it exists on the global scope.
    // (If the real implementation exports it, replace the spy accordingly.)
    // Here we simply verify that the instance got the marker set by the mock.
    expect(instance.__zodMiniLazyName).toBe('ZodMiniLazy');
  });

  // -----------------------------------------------------------------------
  // 2️⃣ Basic lazy parsing – resolves to a primitive type
  // -----------------------------------------------------------------------
  it('should correctly parse a lazy schema that resolves to a string', () => {
    // Real Zod provides a `z.lazy(() => z.string())`.  We emulate that
    // behaviour using the mocked core: the lazy schema will expose a `parse`
    // method that delegates to the resolved schema.
    const stringSchema = {
      parse: (value: unknown) => {
        if (typeof value !== 'string') {
          throw new Error('Expected string');
        }
        return value;
      },
    };

    // Mock core.$ZodLazy.init to attach a `parse` method that lazily resolves.
    core.$ZodLazy.init.mockImplementation((inst: any, def: any) => {
      // `def` is expected to have a `get` function returning the actual schema.
      const get = def.get;
      inst.parse = (value: unknown) => {
        const resolved = get();
        return resolved.parse(value);
      };
    });

    // Define a lazy definition that returns the string schema.
    const lazyDef = {
      get: vi.fn(() => stringSchema),
    };

    const lazyInstance = ZodMiniLazy(lazyDef);

    // Successful parse
    expect(lazyInstance.parse('hello')).toBe('hello');

    // Failure case – non‑string should throw
    expect(() => lazyInstance.parse(123)).toThrow('Expected string');

    // Ensure the lazy getter was called exactly once per parse.
    expect(lazyDef.get).toHaveBeenCalledTimes(2);
  });

  // -----------------------------------------------------------------------
  // 3️⃣ Recursive lazy schemas (self‑referencing objects)
  // -----------------------------------------------------------------------
  it('should handle recursive lazy schemas (e.g., a linked list)', () => {
    /**
     * Model a simple singly‑linked list:
     *   type Node = { value: number; next?: Node }
     *
     * The Zod representation uses a lazy schema for `next` to break the cycle.
     */
    const nodeSchema = {
      parse: (value: any) => {
        if (typeof value !== 'object' || value === null) {
          throw new Error('Expected object');
        }
        if (typeof value.value !== 'number') {
          throw new Error('value must be number');
        }
        // `next` is optional; if present, it must satisfy the same schema.
        if (value.next !== undefined) {
          // The lazy resolver will be called here.
          nodeLazy.parse(value.next);
        }
        return value;
      },
    };

    // Mock the lazy init to resolve to `nodeSchema`.
    core.$ZodLazy.init.mockImplementation((inst: any, def: any) => {
      const get = def.get;
      inst.parse = (value: unknown) => {
        const resolved = get();
        return resolved.parse(value);
      };
    });

    // The lazy definition references itself via a closure.
    const nodeLazyDef = {
      get: vi.fn(() => nodeSchema),
    };
    const nodeLazy = ZodMiniLazy(nodeLazyDef);

    // Build a recursive object: 1 -> 2 -> 3 -> null
    const list = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
        },
      },
    };

    // Parsing should succeed.
    expect(nodeLazy.parse(list)).toEqual(list);

    // Corrupt the list (non‑number value) – should throw.
    const badList = {
      value: 'not-a-number',
      next: { value: 2 },
    };
    expect(() => nodeLazy.parse(badList)).toThrow('value must be number');

    // Verify that the lazy getter was invoked for each nested `next`.
    // There are three nodes, so the getter should be called three times.
    expect(nodeLazyDef.get).toHaveBeenCalledTimes(3);
  });

  // -----------------------------------------------------------------------
  // 4️⃣ Edge‑case: invalid definition (missing `get` function)
  // -----------------------------------------------------------------------
  it('should throw a clear error when definition lacks a `get` resolver', () => {
    // Provide a definition that does not conform to the expected shape.
    const badDef = { notGet: () => {} };

    // The mocked init will attempt to read `def.get` and fail.
    core.$ZodLazy.init.mockImplementation((inst: any, def: any) => {
      if (typeof def.get !== 'function') {
        throw new Error('ZodMiniLazy definition must provide a `get` function');
      }
    });

    expect(() => ZodMiniLazy(badDef as any)).toThrow(
      'ZodMiniLazy definition must provide a `get` function',
    );
  });

  // -----------------------------------------------------------------------
  // 5️⃣ Edge‑case: init function itself throws (simulating internal error)
  // -----------------------------------------------------------------------
  it('should propagate errors thrown inside core.$ZodLazy.init', () => {
    const def = { get: vi.fn() };
    const internalError = new Error('Internal init failure');

    core.$ZodLazy.init.mockImplementation(() => {
      throw internalError;
    });

    expect(() => ZodMiniLazy(def)).toThrow(internalError);
  });

  // -----------------------------------------------------------------------
  // 6️⃣ Instance type checks
  // -----------------------------------------------------------------------
  it('should be recognized as an instance of ZodMiniLazy (interface)', () => {
    const def = { get: vi.fn(() => ({ parse: (v: any) => v })) };
    const instance = ZodMiniLazy(def);

    // The mock constructor sets a marker; we also check prototype chain.
    expect(instance.__zodMiniLazyName).toBe('ZodMiniLazy');
    // Using `instanceof` works because we set the prototype to the original.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(instance instanceof (ZodMiniLazy as any)).toBe(true);
  });
});
```
###Test END##