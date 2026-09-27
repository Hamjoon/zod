import { describe, it, expect } from "vitest";
import { $ZodUnion } from "./schemas.js";

/**
 * Helper to create a minimal mock Zod‑type that works with $ZodUnion.
 *
 * @param params Configuration of the mock.
 *   - succeed: whether the mock validation should succeed (no issues).
 *   - async:   if true the mock returns a Promise, otherwise a plain object.
 *   - optin / optout: optional flags that $ZodUnion reads lazily.
 *   - values: a Set of primitive values that the mock exposes via `_zod.values`.
 *   - pattern: a RegExp that the mock exposes via `_zod.pattern`.
 */
function mockZod(params: {
  succeed: boolean;
  async?: boolean;
  optin?: "optional";
  optout?: "optional";
  values?: Set<unknown>;
  pattern?: RegExp;
}) {
  const { succeed, async = false, optin, optout, values, pattern } = params;

  const run = (payload: { value: any }, _ctx: any) => {
    const result = { value: payload.value, issues: [] as any[] };
    if (!succeed) {
      result.issues.push({ code: "invalid_union" });
    }
    return async ? Promise.resolve(result) : result;
  };

  return {
    _zod: {
      optin,
      optout,
      values,
      pattern,
      run,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                               Test Suite                                   */
/* -------------------------------------------------------------------------- */

describe("$ZodUnion", () => {
  /* --------------------------- Basic behaviour --------------------------- */

  it("returns the first successful option synchronously", () => {
    const opt1 = mockZod({ succeed: true });
    const opt2 = mockZod({ succeed: false });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    const result = union._zod.parse({ value: 42 }, {});
    expect(result).toEqual({ value: 42, issues: [] });
  });

  it("falls back to a later option when an earlier one fails", () => {
    const opt1 = mockZod({ succeed: false });
    const opt2 = mockZod({ succeed: true });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    const result = union._zod.parse({ value: "ok" }, {});
    expect(result).toEqual({ value: "ok", issues: [] });
  });

  it("aggregates issues when all options fail", () => {
    const opt1 = mockZod({ succeed: false });
    const opt2 = mockZod({ succeed: false });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    const result = union._zod.parse({ value: null }, {});
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  /* --------------------------- Async handling --------------------------- */

  it("handles async options and resolves to a successful result", async () => {
    const opt1 = mockZod({ succeed: false, async: true });
    const opt2 = mockZod({ succeed: true, async: true });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    const result = await union._zod.parse({ value: 123 }, {});
    expect(result).toEqual({ value: 123, issues: [] });
  });

  it("returns aggregated issues when all async options fail", async () => {
    const opt1 = mockZod({ succeed: false, async: true });
    const opt2 = mockZod({ succeed: false, async: true });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    const result = await union._zod.parse({ value: "x" }, {});
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  /* --------------------------- Lazy properties -------------------------- */

  it("computes `optin` lazily based on the options", () => {
    const opt1 = mockZod({ succeed: true, optin: "optional" });
    const opt2 = mockZod({ succeed: true });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.optin).toBe("optional");
    expect(union._zod.optout).toBeUndefined();
  });

  it("computes `optout` lazily based on the options", () => {
    const opt1 = mockZod({ succeed: true, optout: "optional" });
    const opt2 = mockZod({ succeed: true });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.optout).toBe("optional");
    expect(union._zod.optin).toBeUndefined();
  });

  /* --------------------------- `values` aggregation -------------------- */

  it("combines `values` sets when every option provides them", () => {
    const opt1 = mockZod({ succeed: true, values: new Set([1, 2]) });
    const opt2 = mockZod({ succeed: true, values: new Set([2, 3]) });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.values).toBeInstanceOf(Set);
    expect(Array.from(union._zod.values!)).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  it("leaves `values` undefined if any option lacks a values set", () => {
    const opt1 = mockZod({ succeed: true, values: new Set([1]) });
    const opt2 = mockZod({ succeed: true }); // no `values`
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.values).toBeUndefined();
  });

  /* --------------------------- `pattern` aggregation -------------------- */

  it("creates a combined RegExp pattern when all options have a pattern", () => {
    const opt1 = mockZod({ succeed: true, pattern: /^foo$/ });
    const opt2 = mockZod({ succeed: true, pattern: /^bar$/ });
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.pattern).toBeInstanceOf(RegExp);
    expect(union._zod.pattern!.test("foo")).toBe(true);
    expect(union._zod.pattern!.test("bar")).toBe(true);
    expect(union._zod.pattern!.test("baz")).toBe(false);
  });

  it("does not create a combined pattern if any option lacks one", () => {
    const opt1 = mockZod({ succeed: true, pattern: /^a$/ });
    const opt2 = mockZod({ succeed: true }); // no pattern
    const union = $ZodUnion({ type: "union", options: [opt1, opt2] }) as any;

    expect(union._zod.pattern).toBeUndefined();
  });

  /* --------------------------- Exception handling ---------------------- */

  it("propagates an exception thrown by an option's `run` method", () => {
    const throwingOption = {
      _zod: {
        run: () => {
          throw new Error("boom");
        },
      },
    };
    const goodOption = mockZod({ succeed: true });
    const union = $ZodUnion({ type: "union", options: [throwingOption, goodOption] }) as any;

    expect(() => union._zod.parse({ value: 0 }, {})).toThrow("boom");
  });

  it("throws when constructed with an empty options array", () => {
    // The library does not explicitly guard against this, but a realistic
    // implementation would throw – we assert that an error is raised.
    expect(() =>
      $ZodUnion({ type: "union", options: [] })
    ).toThrow();
  });
});
