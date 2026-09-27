###Test START##
```ts
/**
 * Vitest test suite for the `ZodMiniBigInt` schema.
 *
 * The tests cover:
 *  - Basic parsing of valid `bigint` values.
 *  - Rejection of invalid types (number, string, object, etc.).
 *  - Safe parsing (`safeParse`) with success and error branches.
 *  - Schema modifiers that are expected to be present on a Zod `bigint` schema:
 *      * `.optional()`
 *      * `.nullable()`
 *      * `.default()`
 *      * `.min()` / `.max()`
 *      * `.refine()`
 *      * `.transform()`
 *  - Edge‑case handling such as extremely large/small `bigint`s and `NaN`‑like values.
 *
 * The implementation of `ZodMiniBigInt` is a thin wrapper around Zod’s internal
 * `bigint` schema (`core.$ZodBigInt`). Therefore the behaviour should mirror the
 * official Zod API. The tests are written defensively – if any of the
 * expectations fail, the test suite will surface the discrepancy.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniBigInt } from "./schemas.js";

describe("ZodMiniBigInt – core functionality", () => {
  /** Helper to create a fresh schema for each test */
  const createSchema = () => ZodMiniBigInt();

  it("should parse a valid bigint value", () => {
    const schema = createSchema();
    const value = 123n;
    expect(schema.parse(value)).toBe(value);
  });

  it("should reject non‑bigint primitive types", () => {
    const schema = createSchema();
    const invalidValues = [
      123, // number
      "123", // string
      true, // boolean
      null,
      undefined,
      Symbol("bigint"),
      {}, // plain object
      [], // array
    ];

    for (const val of invalidValues) {
      expect(() => schema.parse(val as any)).toThrowError(
        /Expected bigint/
      );
    }
  });

  it("should reject objects that look like bigints (e.g., Number objects)", () => {
    const schema = createSchema();
    // eslint-disable-next-line no-new-wrappers
    const numberObject = new Number(123);
    expect(() => schema.parse(numberObject as any)).toThrowError(
      /Expected bigint/
    );
  });

  it("should safely parse valid and invalid values via safeParse", () => {
    const schema = createSchema();

    // Success case
    const success = schema.safeParse(42n);
    expect(success.success).toBe(true);
    if (success.success) {
      expect(success.data).toBe(42n);
    }

    // Failure case
    const failure = schema.safeParse("42" as any);
    expect(failure.success).toBe(false);
    if (!failure.success) {
      expect(failure.error.errors[0].message).toMatch(/Expected bigint/);
    }
  });
});

describe("ZodMiniBigInt – schema modifiers", () => {
  const baseSchema = ZodMiniBigInt();

  it("optional() should allow undefined", () => {
    const schema = baseSchema.optional();
    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse(0n)).toBe(0n);
  });

  it("nullable() should allow null", () => {
    const schema = baseSchema.nullable();
    expect(schema.parse(null)).toBeNull();
    expect(schema.parse(1n)).toBe(1n);
  });

  it("default() should supply a fallback value when input is undefined", () => {
    const defaultValue = 999n;
    const schema = baseSchema.default(defaultValue);
    // When undefined, the default is applied
    expect(schema.parse(undefined)).toBe(defaultValue);
    // When a valid bigint is supplied, the supplied value wins
    expect(schema.parse(5n)).toBe(5n);
  });

  it("min() should enforce a lower bound", () => {
    const minValue = 10n;
    const schema = baseSchema.min(minValue, { message: "Too small" });

    // Value equal to min passes
    expect(schema.parse(10n)).toBe(10n);
    // Value greater than min passes
    expect(schema.parse(11n)).toBe(11n);
    // Value less than min throws
    expect(() => schema.parse(9n)).toThrowError(/Too small/);
  });

  it("max() should enforce an upper bound", () => {
    const maxValue = 20n;
    const schema = baseSchema.max(maxValue, { message: "Too large" });

    // Value equal to max passes
    expect(schema.parse(20n)).toBe(20n);
    // Value less than max passes
    expect(schema.parse(19n)).toBe(19n);
    // Value greater than max throws
    expect(() => schema.parse(21n)).toThrowError(/Too large/);
  });

  it("min() + max() together should enforce a range", () => {
    const schema = baseSchema
      .min(5n, { message: "Below min" })
      .max(15n, { message: "Above max" });

    expect(schema.parse(5n)).toBe(5n);
    expect(schema.parse(10n)).toBe(10n);
    expect(schema.parse(15n)).toBe(15n);
    expect(() => schema.parse(4n)).toThrowError(/Below min/);
    expect(() => schema.parse(16n)).toThrowError(/Above max/);
  });

  it("refine() should allow custom validation logic", () => {
    const isEven = (val: bigint) => val % 2n === 0n;
    const schema = baseSchema.refine(isEven, {
      message: "Must be an even bigint",
    });

    expect(schema.parse(8n)).toBe(8n);
    expect(() => schema.parse(7n)).toThrowError(/Must be an even bigint/);
  });

  it("transform() should convert bigint to string", () => {
    const schema = baseSchema.transform((val) => val.toString());

    const result = schema.parse(123n);
    expect(result).toBe("123");
    // The transformed type is now `string`, so TypeScript inference works:
    // (result as string).toUpperCase(); // should be allowed
  });
});

describe("ZodMiniBigInt – edge cases", () => {
  const schema = ZodMiniBigInt();

  it("should handle extremely large bigint values", () => {
    const huge = 2n ** 256n; // a very large bigint
    expect(schema.parse(huge)).toBe(huge);
  });

  it("should handle negative bigint values", () => {
    const negative = -42n;
    expect(schema.parse(negative)).toBe(negative);
  });

  it("should reject NaN‑like values (e.g., Number.NaN) even though they are not bigint", () => {
    // Even though NaN is a number, we test that the schema does not coerce it.
    expect(() => schema.parse(Number.NaN as any)).toThrowError(/Expected bigint/);
  });

  it("should reject BigInt objects created via Object()", () => {
    const obj = Object(123n);
    expect(() => schema.parse(obj as any)).toThrowError(/Expected bigint/);
  });
});
```
###Test END##