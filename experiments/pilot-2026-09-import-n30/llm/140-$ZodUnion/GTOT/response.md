**$ZodUnion.test.ts**

```ts
###Test START##
import { describe, it, expect, vi } from "vitest";
import { $ZodUnion } from "./schemas.js";

/* -------------------------------------------------------------------------
   Helper – mock schema that mimics the minimal $ZodType interface used by
   $ZodUnion.  Each mock schema implements:
     - _zod.run(payload, ctx)            – synchronous or asynchronous validation
     - _zod.optin / _zod.optout          – optional‑in / optional‑out flags
     - _zod.values?                      – Set of primitive values (optional)
     - _zod.pattern?                     – RegExp pattern (optional)
   The `run` method returns an object `{ value, issues }` where `issues` is an
   array that stays empty on success.
-------------------------------------------------------------------------- */
type MockSchema = {
  _zod: {
    run: (payload: { value: unknown; issues: any[] }, ctx: any) => any;
    optin?: "optional";
    optout?: "optional";
    values?: Set<unknown>;
    pattern?: RegExp;
  };
};

/* -------------------------------------------------------------------------
   Factory to create a mock schema for a given primitive type.
   `async` toggles whether `run` returns a Promise.
-------------------------------------------------------------------------- */
function createMockSchema<T extends unknown>(
  predicate: (v: unknown) => v is T,
  options?: {
    async?: boolean;
    optin?: "optional";
    optout?: "optional";
    values?: Set<unknown>;
    pattern?: RegExp;
  }
): MockSchema {
  const { async = false, optin, optout, values, pattern } = options ?? {};

  const syncRun = (payload: { value: unknown; issues: any[] }) => {
    if (predicate(payload.value)) {
      return { value: payload.value, issues: [] };
    }
    payload.issues.push({
      code: "invalid_type",
      expected: predicate.name,
      received: typeof payload.value,
    });
    return { value: payload.value, issues: payload.issues };
  };

  const run = async
    ? (payload: any, ctx: any) => Promise.resolve(syncRun(payload))
    : syncRun;

  return {
    _zod: {
      run,
      ...(optin && { optin }),
      ...(optout && { optout }),
      ...(values && { values }),
      ...(pattern && { pattern }),
    },
  };
}

/* -------------------------------------------------------------------------
   Utility to instantiate a $ZodUnion instance.
   `$ZodUnion` exported from `schemas.js` is a *constructor function* that
   expects `(inst, def)`.  We create a plain object `inst` and let the
   constructor populate it with the lazy properties and the `parse` method.
-------------------------------------------------------------------------- */
function buildUnion(options: readonly MockSchema[]) {
  const def = { type: "union" as const, options };
  const inst: any = {};
  // The exported `$ZodUnion` is a core.$constructor – it mutates `inst`.
  $ZodUnion(inst, def);
  return inst as {
    _zod: {
      parse: (payload: { value: unknown; issues: any[] }, ctx: any) => any;
      optin?: "optional";
      optout?: "optional";
      values?: Set<unknown>;
      pattern?: RegExp;
    };
  };
}

/* -------------------------------------------------------------------------
   Test Suite
-------------------------------------------------------------------------- */
describe("$ZodUnion – core behaviour", () => {
  /* -------------------------------------------------------------
     1️⃣  Basic synchronous union parsing
     ------------------------------------------------------------- */
  it("parses a value that matches the first schema (sync)", () => {
    const numberSchema = createMockSchema((v): v is number => typeof v === "number");
    const stringSchema = createMockSchema((v): v is string => typeof v === "string");

    const union = buildUnion([numberSchema, stringSchema]);

    const payload = { value: 42, issues: [] };
    const result = union._zod.parse(payload, undefined);

    expect(result).toEqual({ value: 42, issues: [] });
  });

  it("parses a value that matches the second schema (sync)", () => {
    const numberSchema = createMockSchema((v): v is number => typeof v === "number");
    const stringSchema = createMockSchema((v): v is string => typeof v === "string");

    const union = buildUnion([numberSchema, stringSchema]);

    const payload = { value: "hello", issues: [] };
    const result = union._zod.parse(payload, undefined);

    expect(result).toEqual({ value: "hello", issues: [] });
  });

  it("fails when no schema matches (sync)", () => {
    const numberSchema = createMockSchema((v): v is number => typeof v === "number");
    const stringSchema = createMockSchema((v): v is string => typeof v === "string");

    const union = buildUnion([numberSchema, stringSchema]);

    const payload = { value: true, issues: [] };
    const result = union._zod.parse(payload, undefined);

    // All schemas ran, each pushed an issue → result contains the issues of the
    // *last* schema (the implementation returns the aggregated array).
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe("invalid_type");
  });

  /* -------------------------------------------------------------
     2️⃣  Asynchronous schema handling
     ------------------------------------------------------------- */
  it("handles a mix of async and sync schemas – async path returns a Promise", async () => {
    const asyncNumberSchema = createMockSchema(
      (v): v is number => typeof v === "number",
      { async: true }
    );
    const stringSchema = createMockSchema((v): v is string => typeof v === "string");

    const union = buildUnion([asyncNumberSchema, stringSchema]);

    const payload = { value: 7, issues: [] };
    const result = union._zod.parse(payload, undefined);

    // Because at least one schema is async, `parse` must return a Promise.
    expect(result).toBeInstanceOf(Promise);
    const resolved = await result;
    expect(resolved).toEqual({ value: 7, issues: [] });
  });

  it("returns a Promise that resolves to the first successful async schema", async () => {
    const asyncNumberSchema = createMockSchema(
      (v): v is number => typeof v === "number",
      { async: true }
    );
    const asyncStringSchema = createMockSchema(
      (v): v is string => typeof v === "string",
      { async: true }
    );

    const union = buildUnion([asyncNumberSchema, asyncStringSchema]);

    const payload = { value: "world", issues: [] };
    const result = union._zod.parse(payload, undefined);
    expect(result).toBeInstanceOf(Promise);
    const resolved = await result;
    expect(resolved).toEqual({ value: "world", issues: [] });
  });

  /* -------------------------------------------------------------
     3️⃣  Lazy `values` aggregation
     ------------------------------------------------------------- */
  it("exposes a Set of all primitive values when every option defines `values`", () => {
    const schemaA = createMockSchema((v): v is number => typeof v === "number", {
      values: new Set([1, 2]),
    });
    const schemaB = createMockSchema((v): v is string => typeof v === "string", {
      values: new Set(["a", "b"]),
    });

    const union = buildUnion([schemaA, schemaB]);

    // `values` is defined lazily – accessing it triggers the computation.
    expect(union._zod.values).toBeInstanceOf(Set);
    expect(Array.from(union._zod.values!)).toEqual([1, 2, "a", "b"]);
  });

  it("leaves `values` undefined if any option lacks a `values` set", () => {
    const schemaA = createMockSchema((v): v is number => typeof v === "number", {
      values: new Set([1]),
    });
    const schemaB = createMockSchema((v): v is string => typeof v === "string"); // no values

    const union = buildUnion([schemaA, schemaB]);

    expect(union._zod.values).toBeUndefined();
  });

  /* -------------------------------------------------------------
     4️⃣  Lazy `pattern` aggregation
     ------------------------------------------------------------- */
  it("combines regex patterns from all options into a single RegExp", () => {
    const schemaA = createMockSchema((v): v is string => typeof v === "string", {
      pattern: /^foo$/i,
    });
    const schemaB = createMockSchema((v): v is string => typeof v === "string", {
      pattern: /^bar$/,
    });

    const union = buildUnion([schemaA, schemaB]);

    expect(union._zod.pattern).toBeInstanceOf(RegExp);
    // The combined pattern should match either "foo" (case‑insensitive) or "bar".
    expect(union._zod.pattern!.test("FOO")).toBe(true);
    expect(union._zod.pattern!.test("bar")).toBe(true);
    expect(union._zod.pattern!.test("baz")).toBe(false);
  });

  it("leaves `pattern` undefined if any option lacks a pattern", () => {
    const schemaA = createMockSchema((v): v is string => typeof v === "string", {
      pattern: /^foo$/,
    });
    const schemaB = createMockSchema((v): v is string => typeof v === "string"); // no pattern

    const union = buildUnion([schemaA, schemaB]);

    expect(union._zod.pattern).toBeUndefined();
  });

  /* -------------------------------------------------------------
     5️⃣  Optional‑in / Optional‑out propagation
     ------------------------------------------------------------- */
  it("sets `optin` to \"optional\" if any option is optional‑in", () => {
    const requiredSchema = createMockSchema((v): v is number => typeof v === "number");
    const optionalSchema = createMockSchema((v): v is string => typeof v === "string", {
      optin: "optional",
    });

    const union = buildUnion([requiredSchema, optionalSchema]);

    expect(union._zod.optin).toBe("optional");
  });

  it("sets `optout` to \"optional\" if any option is optional‑out", () => {
    const requiredSchema = createMockSchema((v): v is number => typeof v === "number");
    const optionalSchema = createMockSchema((v): v is string => typeof v === "string", {
      optout: "optional",
    });

    const union = buildUnion([requiredSchema, optionalSchema]);

    expect(union._zod.optout).toBe("optional");
  });

  it("leaves `optin`/`optout` undefined when no option is optional", () => {
    const schemaA = createMockSchema((v): v is number => typeof v === "number");
    const schemaB = createMockSchema((v): v is string => typeof v === "string");

    const union = buildUnion([schemaA, schemaB]);

    expect(union._zod.optin).toBeUndefined();
    expect(union._zod.optout).toBeUndefined();
  });

  /* -------------------------------------------------------------
     6️⃣  Edge Cases – empty options array
     ------------------------------------------------------------- */
  it("throws when constructing a union with no options", () => {
    // The constructor itself does not guard against an empty array, but the
    // generated `parse` will iterate over zero options and immediately call
    // `handleUnionResults` with an empty result list – this is an illegal state.
    // We assert that calling `parse` throws a clear error.
    const union = buildUnion([] as any);

    const payload = { value: 123, issues: [] };
    expect(() => union._zod.parse(payload, undefined)).toThrowError(
      /union must have at least one option/i
    );
  });
});
###Test END##
```