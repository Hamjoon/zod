/**
 * Vitest test suite for the `$ZodUnion` implementation.
 *
 * The tests cover:
 *  1. Lazy‑computed internals (`optin`, `optout`, `values`, `pattern`)
 *  2. Synchronous parsing (first‑option success, later‑option success, all‑fail)
 *  3. Asynchronous parsing (mixed sync/async options)
 *
 * The real `$ZodUnion` depends on many internal helpers from the library.
 * For the purpose of unit‑testing the behaviour of `$ZodUnion` we create
 * minimal mock `$ZodType` objects that expose only the properties/methods
 * used by `$ZodUnion`.  This keeps the test self‑contained and fast.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { $ZodUnion } from "./schemas.js";
import * as schemasModule from "./schemas.js"; // used to spy on `handleUnionResults`

/* -------------------------------------------------------------------------- */
/* Helper utilities to build mock `$ZodType` objects                         */
/* -------------------------------------------------------------------------- */

type MockParseResult = {
  value: unknown;
  issues: unknown[];
};

type MockZodOption = {
  _zod: {
    /** optional‑in flag – `"optional"` or `undefined` */
    optin?: "optional";
    /** optional‑out flag – `"optional"` or `undefined` */
    optout?: "optional";
    /** a Set of primitive values that the option accepts (or `undefined`) */
    values?: Set<string | number | boolean | null>;
    /** a RegExp that the option matches (or `undefined`) */
    pattern?: RegExp;
    /** the core `run` method used by `$ZodUnion` */
    run: (payload: { value: unknown; issues: unknown[] }, ctx: unknown) => MockParseResult | Promise<MockParseResult>;
  };
};

/**
 * Factory to create a mock `$ZodType` option.
 *
 * Only the fields accessed by `$ZodUnion` are required.
 */
function createMockOption({
  optin,
  optout,
  values,
  pattern,
  run,
}: Partial<MockZodOption["_zod"]>): MockZodOption {
  return {
    _zod: {
      optin,
      optout,
      values,
      pattern,
      // default `run` that simply returns a successful parse result
      run: run ?? (() => ({ value: undefined, issues: [] })),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Common test data                                                          */
/* -------------------------------------------------------------------------- */

const ctx = {}; // parsing context – not used by our mocks

/** payload shape expected by `$ZodUnion` */
function makePayload(v: unknown) {
  return { value: v, issues: [] };
}

/* -------------------------------------------------------------------------- */
/* Test suite                                                                  */
/* -------------------------------------------------------------------------- */

describe("$ZodUnion – lazy internals", () => {
  it("computes `optin` as \"optional\" when any option is optional", () => {
    const optOption = createMockOption({ optin: "optional", run: () => ({ value: 1, issues: [] }) });
    const nonOptOption = createMockOption({ run: () => ({ value: 2, issues: [] }) });

    const union = $ZodUnion({ options: [optOption, nonOptOption] } as any);
    expect(union._zod.optin).toBe("optional");
  });

  it("leaves `optin` undefined when no option is optional", () => {
    const a = createMockOption({ run: () => ({ value: 1, issues: [] }) });
    const b = createMockOption({ run: () => ({ value: 2, issues: [] }) });

    const union = $ZodUnion({ options: [a, b] } as any);
    expect(union._zod.optin).toBeUndefined();
  });

  it("computes `optout` as \"optional\" when any option is optional on output", () => {
    const optOption = createMockOption({ optout: "optional", run: () => ({ value: 1, issues: [] }) });
    const nonOptOption = createMockOption({ run: () => ({ value: 2, issues: [] }) });

    const union = $ZodUnion({ options: [optOption, nonOptOption] } as any);
    expect(union._zod.optout).toBe("optional");
  });

  it("leaves `optout` undefined when no option is optional on output", () => {
    const a = createMockOption({ run: () => ({ value: 1, issues: [] }) });
    const b = createMockOption({ run: () => ({ value: 2, issues: [] }) });

    const union = $ZodUnion({ options: [a, b] } as any);
    expect(union._zod.optout).toBeUndefined();
  });

  it("aggregates `values` into a Set when every option provides a Set", () => {
    const optA = createMockOption({
      values: new Set([1, 2]),
      run: () => ({ value: 1, issues: [] }),
    });
    const optB = createMockOption({
      values: new Set([2, 3]),
      run: () => ({ value: 2, issues: [] }),
    });

    const union = $ZodUnion({ options: [optA, optB] } as any);
    const expected = new Set([1, 2, 3]);
    expect(union._zod.values).toEqual(expected);
  });

  it("sets `values` to undefined when at least one option lacks a Set", () => {
    const optA = createMockOption({
      values: new Set([1, 2]),
      run: () => ({ value: 1, issues: [] }),
    });
    const optB = createMockOption({
      // no `values` property
      run: () => ({ value: 2, issues: [] }),
    });

    const union = $ZodUnion({ options: [optA, optB] } as any);
    expect(union._zod.values).toBeUndefined();
  });

  it("combines regex patterns when every option supplies one", () => {
    const optA = createMockOption({
      pattern: /^foo$/,
      run: () => ({ value: "foo", issues: [] }),
    });
    const optB = createMockOption({
      pattern: /^bar$/,
      run: () => ({ value: "bar", issues: [] }),
    });

    const union = $ZodUnion({ options: [optA, optB] } as any);
    const combined = union._zod.pattern as RegExp;

    // The combined pattern should match either "foo" or "bar"
    expect(combined.test("foo")).toBe(true);
    expect(combined.test("bar")).toBe(true);
    expect(combined.test("baz")).toBe(false);
  });

  it("leaves `pattern` undefined when any option lacks a pattern", () => {
    const optA = createMockOption({
      pattern: /^foo$/,
      run: () => ({ value: "foo", issues: [] }),
    });
    const optB = createMockOption({
      // no pattern
      run: () => ({ value: "bar", issues: [] }),
    });

    const union = $ZodUnion({ options: [optA, optB] } as any);
    expect(union._zod.pattern).toBeUndefined();
  });
});

describe("$ZodUnion – parsing", () => {
  beforeEach(() => {
    // Reset any spy on `handleUnionResults` before each test
    vi.restoreAllMocks();
  });

  it("returns the first successful synchronous result", () => {
    const failOption = createMockOption({
      run: () => ({ value: undefined, issues: [{ code: "invalid" }] }),
    });
    const successOption = createMockOption({
      run: () => ({ value: "ok", issues: [] }),
    });

    const union = $ZodUnion({ options: [failOption, successOption] } as any);
    const result = union._zod.parse(makePayload(123), ctx) as MockParseResult;

    expect(result).toEqual({ value: "ok", issues: [] });
  });

  it("returns a successful result when the first option resolves asynchronously", async () => {
    const asyncSuccess = createMockOption({
      run: () => Promise.resolve({ value: "async‑ok", issues: [] }),
    });
    const syncFail = createMockOption({
      run: () => ({ value: undefined, issues: [{ code: "invalid" }] }),
    });

    const union = $ZodUnion({ options: [syncFail, asyncSuccess] } as any);
    const result = await union._zod.parse(makePayload("test"), ctx) as MockParseResult;

    expect(result).toEqual({ value: "async‑ok", issues: [] });
  });

  it("delegates to `handleUnionResults` when all options fail (sync case)", () => {
    const failA = createMockOption({
      run: () => ({ value: undefined, issues: [{ code: "a" }] }),
    });
    const failB = createMockOption({
      run: () => ({ value: undefined, issues: [{ code: "b" }] }),
    });

    const union = $ZodUnion({ options: [failA, failB] } as any);

    // Mock the internal helper to return a deterministic payload
    const mockedResult = { value: undefined, issues: [{ code: "union‑failed" }] };
    vi.spyOn(schemasModule, "handleUnionResults").mockImplementation(() => mockedResult as any);

    const result = union._zod.parse(makePayload("x"), ctx) as MockParseResult;
    expect(result).toBe(mockedResult);
    expect(schemasModule.handleUnionResults).toHaveBeenCalledOnce();
  });

  it("delegates to `handleUnionResults` when all options fail (async case)", async () => {
    const failA = createMockOption({
      run: () => Promise.resolve({ value: undefined, issues: [{ code: "a" }] }),
    });
    const failB = createMockOption({
      run: () => ({ value: undefined, issues: [{ code: "b" }] }),
    });

    const union = $ZodUnion({ options: [failA, failB] } as any);

    const mockedResult = { value: undefined, issues: [{ code: "union‑failed‑async" }] };
    vi.spyOn(schemasModule, "handleUnionResults").mockImplementation(() => mockedResult as any);

    const result = await union._zod.parse(makePayload("y"), ctx) as MockParseResult;
    expect(result).toBe(mockedResult);
    expect(schemasModule.handleUnionResults).toHaveBeenCalledOnce();
  });
});
