/**
 * Vitest test suite for the `ZodMiniLazy` class.
 *
 * The class is exported from `./schemas.js` and is created via
 * `core.$constructor`.  It does not declare its own public methods
 * directly – it inherits the API of a Zod schema (e.g. `parse`,
 * `safeParse`, `refine`, etc.) from the internal `_ZodMiniType`
 * implementation.  The tests below therefore focus on the behaviour
 * that is observable through that public API.
 *
 * The test strategy follows the steps described in the prompt:
 *   1. List the public methods (inherited from the Zod base type).
 *   2. Write a basic test for each method.
 *   3. Identify edge‑cases and error scenarios.
 *   4. Add dedicated tests for those edge‑cases.
 *   5. Combine everything into a single test file.
 *
 * Because the actual implementation of the base type (`_ZodMiniType`)
 * is not part of the provided snippet, the tests use the public
 * contract that Zod‑like schemas expose – namely `parse`,
 * `safeParse`, `optional`, `nullable`, and `default`.  If the library
 * adds or removes methods, the test suite can be updated accordingly.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniLazy } from "./schemas.js";

/**
 * Helper: a very simple schema that validates a string.
 *
 * The real library provides many primitive schemas (e.g. `ZodMiniString`,
 * `ZodMiniNumber`, …).  For the purpose of these tests we create a tiny
 * mock schema that mimics the essential behaviour of a Zod schema.
 *
 * This mock is only used inside the lazy definition – it does **not**
 * interfere with the actual `ZodMiniLazy` implementation.
 */
function mockStringSchema() {
  return {
    // The `parse` method throws on invalid input and returns the value otherwise.
    parse(value: unknown) {
      if (typeof value !== "string") {
        throw new Error("Invalid type, expected string");
      }
      return value;
    },
    // `safeParse` returns an object with `success` and either `data` or `error`.
    safeParse(value: unknown) {
      try {
        const data = this.parse(value);
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    },
    // The following methods are chainable and return the same mock object.
    optional() {
      return this;
    },
    nullable() {
      return this;
    },
    default(def: unknown) {
      // Store the default for later use in `parse`.
      (this as any)._default = def;
      return this;
    },
    // When a default is set, `parse(undefined)` returns it.
    _default: undefined as unknown,
    parseWithDefault(value: unknown) {
      if (value === undefined && (this as any)._default !== undefined) {
        return (this as any)._default;
      }
      return this.parse(value);
    },
  } as any;
}

/**
 * PUBLIC METHODS (inherited from the Zod base type)
 *
 * The following methods are part of the public contract of a Zod‑like
 * schema and are therefore expected to be available on a
 * `ZodMiniLazy` instance:
 *
 *   - parse(value: unknown): T
 *   - safeParse(value: unknown): { success: true; data: T } | { success: false; error: ZodError }
 *   - optional(): ZodMiniLazy<T | undefined>
 *   - nullable(): ZodMiniLazy<T | null>
 *   - default(value: T): ZodMiniLazy<T>
 *
 * The tests below cover each of these methods.
 */

describe("ZodMiniLazy – basic functionality", () => {
  // Create a lazy schema that resolves to the mock string schema.
  const lazyString = ZodMiniLazy(() => mockStringSchema());

  it("should expose a `parse` method that validates correct input", () => {
    expect(lazyString.parse("hello")).toBe("hello");
  });

  it("should expose a `parse` method that throws on invalid input", () => {
    expect(() => lazyString.parse(123 as any)).toThrowError(
      "Invalid type, expected string"
    );
  });

  it("should expose a `safeParse` method that returns success for valid data", () => {
    const result = lazyString.safeParse("world");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("world");
    }
  });

  it("should expose a `safeParse` method that returns failure for invalid data", () => {
    const result = lazyString.safeParse(456 as any);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Invalid type, expected string");
    }
  });

  it("should support `optional` chaining without altering validation", () => {
    const optionalLazy = lazyString.optional();
    // The optional schema should still accept a string.
    expect(optionalLazy.parse("opt")).toBe("opt");
    // And it should also accept `undefined` (the mock simply returns undefined).
    expect(optionalLazy.parse(undefined as any)).toBeUndefined();
  });

  it("should support `nullable` chaining without altering validation", () => {
    const nullableLazy = lazyString.nullable();
    // Accept a string.
    expect(nullableLazy.parse("null")).toBe("null");
    // Accept `null`.
    expect(nullableLazy.parse(null as any)).toBeNull();
  });

  it("should support `default` and return the default when parsing undefined", () => {
    const defaultValue = "default‑value";
    const withDefault = lazyString.default(defaultValue);
    // When value is undefined, the default should be returned.
    expect(withDefault.parse(undefined as any)).toBe(defaultValue);
    // When a proper value is supplied, it should be returned unchanged.
    expect(withDefault.parse("real")).toBe("real");
  });
});

/**
 * EDGE CASES & EXCEPTION SCENARIOS
 *
 * The following tests target situations that are likely to cause
 * unexpected behaviour or errors:
 *
 *   1. Passing a non‑function to the lazy constructor.
 *   2. The definition function returning a non‑schema object.
 *   3. Recursive (circular) lazy schemas.
 *   4. Errors thrown inside the definition function.
 */
describe("ZodMiniLazy – edge cases & error handling", () => {
  it("should throw if the lazy definition is not a function", () => {
    // @ts-expect-error – intentionally passing a wrong type.
    expect(() => ZodMiniLazy(123 as any)).toThrowError();
  });

  it("should throw if the definition function returns a non‑schema", () => {
    const badLazy = ZodMiniLazy(() => ({ not: "a schema" }));
    // The underlying implementation will try to initialise the internals;
    // we expect an error when we attempt to use the schema.
    expect(() => badLazy.parse("anything")).toThrowError();
  });

  it("should correctly handle recursive lazy schemas", () => {
    // Define a simple recursive type: a node that can contain another node or a string.
    type Node = string | { child: Node };

    // Lazy schema that resolves to a union of string and an object containing a lazy reference.
    const NodeSchema: any = ZodMiniLazy(() =>
      // For the purpose of the test we reuse the mockStringSchema for the string branch
      // and manually construct the object branch.
      ({
        parse(value: unknown) {
          if (typeof value === "string") {
            return value;
          }
          if (typeof value === "object" && value !== null && "child" in (value as any)) {
            // Recursively parse the child using the same lazy schema.
            return {
              child: NodeSchema.parse((value as any).child),
            };
          }
          throw new Error("Invalid node");
        },
        safeParse(value: unknown) {
          try {
            const data = this.parse(value);
            return { success: true, data };
          } catch (error) {
            return { success: false, error };
          }
        },
        optional() {
          return this;
        },
        nullable() {
          return this;
        },
        default(def: unknown) {
          (this as any)._default = def;
          return this;
        },
      })
    );

    const validTree: Node = {
      child: {
        child: "leaf",
      },
    };

    // Should parse without throwing.
    expect(NodeSchema.parse(validTree)).toEqual(validTree);

    // Invalid structure should cause an error.
    const invalidTree = { child: { wrong: "field" } };
    expect(() => NodeSchema.parse(invalidTree as any)).toThrowError("Invalid node");
  });

  it("should propagate errors thrown inside the definition function", () => {
    const errorMessage = "Definition failure";
    const failingLazy = ZodMiniLazy(() => {
      throw new Error(errorMessage);
    });

    // Attempting to use the schema should re‑throw the original error.
    expect(() => failingLazy.parse("anything")).toThrowError(errorMessage);
  });
});

/**
 * SUMMARY
 *
 * The test suite covers:
 *   • Basic usage of each public method (`parse`, `safeParse`, `optional`,
 *     `nullable`, `default`).
 *   • Edge cases such as invalid constructor arguments, non‑schema returns,
 *     recursive schemas, and errors inside the definition function.
 *
 * If the underlying library evolves (e.g., new public methods are added),
 * the suite can be extended by adding corresponding `it` blocks following the
 * same pattern.
 */
