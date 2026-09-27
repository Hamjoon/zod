**###Test START##**

```ts
/**
 * Vitest test suite for the `ZodMiniBigInt` schema.
 *
 * The tests cover:
 * 1. Public API surface (method signatures) inferred from Zod's `ZodBigInt`.
 * 2. Basic functionality of each method.
 * 3. Edge‑case and error‑handling scenarios.
 *
 * NOTE:
 * - The actual implementation of `ZodMiniBigInt` lives in `./schemas.js`.
 * - The test file assumes that `ZodMiniBigInt` behaves like Zod's native
 *   `z.bigint()` schema (i.e. it provides `.parse`, `.safeParse`, `.min`,
 *   `.max`, `.multipleOf`, `.optional`, `.nullable`, `.default`, `.describe`,
 *   etc.).
 * - If the underlying library deviates from Zod’s API, adjust the imports
 *   and expectations accordingly.
 */

import { describe, it, expect } from "vitest";
import { ZodMiniBigInt } from "./schemas.js";

/* -------------------------------------------------------------------------- */
/* 1️⃣  Public methods (inferred signatures)                                   */
/* -------------------------------------------------------------------------- */
/*
  ZodMiniBigInt(): ZodMiniBigInt
  .parse(value: unknown): bigint
  .safeParse(value: unknown):
        | { success: true; data: bigint }
        | { success: false; error: ZodError }
  .min(min: bigint, message?: string): this
  .max(max: bigint, message?: string): this
  .multipleOf(value: bigint, message?: string): this
  .refine(check: (arg: bigint) => boolean, message?: string): this
  .optional(): ZodOptional<ZodMiniBigInt>
  .nullable(): ZodNullable<ZodMiniBigInt>
  .default(value: bigint): ZodDefault<ZodMiniBigInt>
  .describe(description: string): this
  // plus all generic ZodType methods like .or, .and, .transform, etc.
*/

describe("ZodMiniBigInt – basic API", () => {
  it("should create a schema instance", () => {
    const schema = ZodMiniBigInt();
    expect(typeof schema.parse).toBe("function");
    expect(typeof schema.safeParse).toBe("function");
    expect(typeof schema.min).toBe("function");
    expect(typeof schema.max).toBe("function");
    expect(typeof schema.multipleOf).toBe("function");
    expect(typeof schema.optional).toBe("function");
    expect(typeof schema.nullable).toBe("function");
    expect(typeof schema.default).toBe("function");
    expect(typeof schema.describe).toBe("function");
  });

  it("parses a valid bigint", () => {
    const schema = ZodMiniBigInt();
    const result = schema.parse(42n);
    expect(result).toBe(42n);
  });

  it("throws on non‑bigint values (parse)", () => {
    const schema = ZodMiniBigInt();
    const badValues = ["123", 123, null, undefined, {}, []];
    for (const v of badValues) {
      expect(() => schema.parse(v as any)).toThrowError();
    }
  });

  it("safeParse returns success for valid bigint", () => {
    const schema = ZodMiniBigInt();
    const out = schema.safeParse(100n);
    expect(out.success).toBe(true);
    if (out.success) {
      expect(out.data).toBe(100n);
    }
  });

  it("safeParse returns failure for invalid values", () => {
    const schema = ZodMiniBigInt();
    const out = schema.safeParse("not a bigint" as any);
    expect(out.success).toBe(false);
    if (!out.success) {
      expect(out.error).toBeDefined();
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 2️⃣  Constraint methods (`min`, `max`, `multipleOf`)                         */
/* -------------------------------------------------------------------------- */
describe("ZodMiniBigInt – constraint methods", () => {
  const MIN = 10n;
  const MAX = 100n;
  const STEP = 5n;

  it("accepts values equal to the minimum", () => {
    const schema = ZodMiniBigInt().min(MIN);
    expect(schema.parse(MIN)).toBe(MIN);
  });

  it("rejects values smaller than the minimum", () => {
    const schema = ZodMiniBigInt().min(MIN);
    expect(() => schema.parse(9n)).toThrowError();
  });

  it("accepts values equal to the maximum", () => {
    const schema = ZodMiniBigInt().max(MAX);
    expect(schema.parse(MAX)).toBe(MAX);
  });

  it("rejects values larger than the maximum", () => {
    const schema = ZodMiniBigInt().max(MAX);
    expect(() => schema.parse(101n)).toThrowError();
  });

  it("accepts values that are multiples of a given divisor", () => {
    const schema = ZodMiniBigInt().multipleOf(STEP);
    expect(schema.parse(20n)).toBe(20n);
  });

  it("rejects values that are not multiples of the divisor", () => {
    const schema = ZodMiniBigInt().multipleOf(STEP);
    expect(() => schema.parse(22n)).toThrowError();
  });

  it("throws when `multipleOf` is called with zero (division by zero)", () => {
    const create = () => ZodMiniBigInt().multipleOf(0n);
    expect(create).toThrowError();
  });

  it("chains multiple constraints correctly", () => {
    const schema = ZodMiniBigInt().min(20n).max(50n).multipleOf(5n);
    // valid
    expect(schema.parse(35n)).toBe(35n);
    // below min
    expect(() => schema.parse(15n)).toThrowError();
    // above max
    expect(() => schema.parse(55n)).toThrowError();
    // not a multiple
    expect(() => schema.parse(33n)).toThrowError();
  });
});

/* -------------------------------------------------------------------------- */
/* 3️⃣  Optional / Nullable / Default handling                                 */
/* -------------------------------------------------------------------------- */
describe("ZodMiniBigInt – optional / nullable / default", () => {
  it("optional schema accepts undefined", () => {
    const schema = ZodMiniBigInt().optional();
    expect(schema.parse(undefined)).toBeUndefined();
    // still validates proper bigint
    expect(schema.parse(7n)).toBe(7n);
  });

  it("nullable schema accepts null", () => {
    const schema = ZodMiniBigInt().nullable();
    expect(schema.parse(null)).toBeNull();
    // still validates proper bigint
    expect(schema.parse(8n)).toBe(8n);
  });

  it("default schema supplies a fallback for undefined", () => {
    const DEFAULT = 123n;
    const schema = ZodMiniBigInt().default(DEFAULT);
    // undefined triggers default
    expect(schema.parse(undefined)).toBe(DEFAULT);
    // explicit undefined via safeParse also yields default
    const out = schema.safeParse(undefined);
    expect(out.success && out.data).toBe(DEFAULT);
    // provided value overrides default
    expect(schema.parse(456n)).toBe(456n);
  });

  it("combination of optional + default works as expected", () => {
    const schema = ZodMiniBigInt().optional().default(0n);
    // undefined -> default
    expect(schema.parse(undefined)).toBe(0n);
    // explicit undefined also -> default
    const out = schema.safeParse(undefined);
    expect(out.success && out.data).toBe(0n);
    // valid bigint passes through
    expect(schema.parse(5n)).toBe(5n);
  });
});

/* -------------------------------------------------------------------------- */
/* 4️⃣  Description & Refinement                                               */
/* -------------------------------------------------------------------------- */
describe("ZodMiniBigInt – description & custom refinement", () => {
  it("stores a description that can be retrieved via .describe()", () => {
    const description = "A positive bigint identifier";
    const schema = ZodMiniBigInt().describe(description);
    // Zod exposes the description via .description (internal) – we test that
    // the property exists and matches.
    // @ts-ignore – internal field used for testing purposes
    expect(schema._def?.description).toBe(description);
  });

  it("accepts a custom refinement that passes", () => {
    const isEven = (v: bigint) => v % 2n === 0n;
    const schema = ZodMiniBigInt().refine(isEven, "Must be even");
    expect(schema.parse(24n)).toBe(24n);
  });

  it("rejects a value that fails the custom refinement", () => {
    const isEven = (v: bigint) => v % 2n === 0n;
    const schema = ZodMiniBigInt().refine(isEven, "Must be even");
    expect(() => schema.parse(25n)).toThrowError(/Must be even/);
  });
});

/* -------------------------------------------------------------------------- */
/* 5️⃣  Edge‑case scenarios                                                    */
/* -------------------------------------------------------------------------- */
describe("ZodMiniBigInt – edge cases", () => {
  it("parses the smallest possible bigint (BigInt can be arbitrarily large)", () => {
    const schema = ZodMiniBigInt();
    const min = -1n << 100n; // a very large negative number
    expect(schema.parse(min)).toBe(min);
  });

  it("parses the largest possible bigint (within JS memory limits)", () => {
    const schema = ZodMiniBigInt();
    const max = 1n << 100n; // a very large positive number
    expect(schema.parse(max)).toBe(max);
  });

  it("handles NaN‑like values (Number.NaN cast to any) – should reject", () => {
    const schema = ZodMiniBigInt();
    // @ts-ignore – intentionally passing a non‑bigint
    expect(() => schema.parse(NaN)).toThrowError();
  });

  it("handles Symbol values – should reject", () => {
    const schema = ZodMiniBigInt();
    // @ts-ignore – intentionally passing a Symbol
    expect(() => schema.parse(Symbol("bigint"))).toThrowError();
  });
});
```

**###Test END##**