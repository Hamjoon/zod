###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniPromise` schema.
 *
 * The tests cover:
 * 1. Basic parsing of a Promise that resolves to a valid value.
 * 2. Rejection handling – parsing a Promise that rejects should produce a Zod error.
 * 3. Type‑checking – parsing a non‑Promise value must fail.
 * 4. Schema modifiers (`optional`, `nullable`, `default`) and their interaction with promises.
 * 5. Edge cases such as `Promise.resolve(undefined)` and `Promise.resolve(null)`.
 *
 * The test file assumes that the library exports a `core` namespace that contains
 * the underlying Zod‑like constructors (`$ZodString`, `$ZodNumber`, `$ZodPromise`, …)
 * and that `ZodMiniPromise` is re‑exported from `./schemas.js`.
 *
 * The implementation of `ZodMiniPromise` mirrors Zod’s `ZodPromise`, therefore
 * the public API (`parseAsync`, `safeParseAsync`, `optional`, `nullable`, `default`)
 * is used in the tests.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniPromise } from "./schemas.js";
import { core } from "./schemas.js"; // assuming core is exported for type helpers

// Helper schemas for inner values
const StringSchema = core.$ZodString(); // a simple string schema
const NumberSchema = core.$ZodNumber(); // a simple number schema

/**
 * Expert 1 – Basic parsing & success case
 */
describe("ZodMiniPromise – basic success parsing", () => {
  it("should correctly parse a Promise that resolves to a valid string", async () => {
    const schema = ZodMiniPromise(StringSchema);
    const input = Promise.resolve("hello world");

    // `parseAsync` returns the resolved value if validation succeeds
    const result = await schema.parseAsync(input);
    expect(result).toBe("hello world");
  });
});

/**
 * Expert 2 – Rejection handling & error scenario
 */
describe("ZodMiniPromise – rejection and invalid inner value", () => {
  it("should raise a Zod error when the inner promise resolves to an invalid value", async () => {
    const schema = ZodMiniPromise(NumberSchema);
    const input = Promise.resolve("not a number" as unknown as number);

    await expect(schema.parseAsync(input)).rejects.toThrowError(/Expected number/);
  });

  it("should raise a Zod error when the promise itself rejects", async () => {
    const schema = ZodMiniPromise(StringSchema);
    const input = Promise.reject(new Error("Promise rejected"));

    await expect(schema.parseAsync(input)).rejects.toThrowError(/Promise rejected/);
  });
});

/**
 * Expert 3 – Non‑promise input & edge cases
 */
describe("ZodMiniPromise – non‑promise inputs and edge cases", () => {
  it("should fail when a non‑Promise value is supplied", async () => {
    const schema = ZodMiniPromise(StringSchema);
    const input = "I am not a promise";

    await expect(schema.parseAsync(input)).rejects.toThrowError(/Expected Promise/);
  });

  it("should correctly handle Promise.resolve(undefined) when the inner schema allows undefined", async () => {
    const schema = ZodMiniPromise(core.$ZodUndefined());
    const input = Promise.resolve(undefined);
    const result = await schema.parseAsync(input);
    expect(result).toBeUndefined();
  });

  it("should correctly handle Promise.resolve(null) when the inner schema allows null", async () => {
    const schema = ZodMiniPromise(core.$ZodNull());
    const input = Promise.resolve(null);
    const result = await schema.parseAsync(input);
    expect(result).toBeNull();
  });
});

/**
 * Expert 1 – Modifiers: optional, nullable, default
 */
describe("ZodMiniPromise – schema modifiers", () => {
  it("optional() should allow undefined without a Promise", async () => {
    const schema = ZodMiniPromise(StringSchema).optional();
    const result = await schema.parseAsync(undefined);
    expect(result).toBeUndefined();
  });

  it("nullable() should allow null without a Promise", async () => {
    const schema = ZodMiniPromise(StringSchema).nullable();
    const result = await schema.parseAsync(null);
    expect(result).toBeNull();
  });

  it("default() should provide a fallback Promise when input is undefined", async () => {
    const fallback = Promise.resolve("fallback");
    const schema = ZodMiniPromise(StringSchema).default(fallback);
    const result = await schema.parseAsync(undefined);
    expect(result).toBe("fallback");
  });

  it("default() should still validate the resolved value of the fallback Promise", async () => {
    const fallback = Promise.resolve(123 as unknown as string); // invalid for string schema
    const schema = ZodMiniPromise(StringSchema).default(fallback);
    await expect(schema.parseAsync(undefined)).rejects.toThrowError(/Expected string/);
  });
});

/**
 * Expert 2 – safeParseAsync usage (returns a result object instead of throwing)
 */
describe("ZodMiniPromise – safeParseAsync", () => {
  it("should return a success result for a valid promise", async () => {
    const schema = ZodMiniPromise(NumberSchema);
    const input = Promise.resolve(42);
    const result = await schema.safeParseAsync(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it("should return a failure result for an invalid inner value", async () => {
    const schema = ZodMiniPromise(NumberSchema);
    const input = Promise.resolve("oops" as unknown as number);
    const result = await schema.safeParseAsync(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/Expected number/);
    }
  });

  it("should return a failure result when the promise rejects", async () => {
    const schema = ZodMiniPromise(StringSchema);
    const input = Promise.reject(new Error("Boom"));
    const result = await schema.safeParseAsync(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/Boom/);
    }
  });
});

/**
 * Expert 3 – Integration with other ZodMini types (e.g., array of promises)
 */
describe("ZodMiniPromise – composition with other schemas", () => {
  it("should validate an array of promises using ZodMiniArray", async () => {
    const PromiseArraySchema = core.$ZodArray(ZodMiniPromise(StringSchema));
    const input = [Promise.resolve("a"), Promise.resolve("b")];
    const result = await PromiseArraySchema.parseAsync(input);
    expect(result).toEqual(["a", "b"]);
  });

  it("should fail if any promise in the array resolves to an invalid value", async () => {
    const PromiseArraySchema = core.$ZodArray(ZodMiniPromise(NumberSchema));
    const input = [Promise.resolve(1), Promise.resolve("bad" as unknown as number)];
    await expect(PromiseArraySchema.parseAsync(input)).rejects.toThrowError(/Expected number/);
  });
});
```
###Test END##