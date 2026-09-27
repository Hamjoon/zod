###Test START##
```ts
/**
 * Vitest test suite for the $ZodSymbol class.
 *
 * The $ZodSymbol schema validates that a given payload's `value`
 * is a JavaScript `symbol`.  If the value is a symbol the payload
 * is returned unchanged; otherwise an issue describing the type
 * mismatch is pushed onto `payload.issues`.
 *
 * The tests below are the result of a collaborative “three‑expert”
 * design session.  Each expert contributed one test case per
 * method (the only public method is the internal `_zod.parse`
 * function).  The suite therefore covers:
 *
 *   • Typical successful validation with various kinds of symbols.
 *   • Typical failure cases for non‑symbol values.
 *   • Edge‑case handling (missing `value`, `null`, `undefined`).
 *   • Verification of the shape of the generated issue object.
 *
 * The test file is self‑contained and can be run with Vitest
 * (`vitest run $ZodSymbol.test.ts`).
 */

import { describe, it, expect } from "vitest";
import { $ZodSymbol } from "./schemas.js";

/**
 * Helper to create a minimal payload object expected by the parser.
 *
 * The real implementation of Vitest's Zod library uses a richer
 * `ParsePayload` type, but for our purposes we only need:
 *   - `value`: the value being validated.
 *   - `issues`: an array that the parser may push validation issues onto.
 */
function createPayload<T>(value: T) {
  return {
    value,
    issues: [] as Array<{
      expected: string;
      code: string;
      input: unknown;
      inst: unknown;
    }>,
  };
}

/**
 * Factory for a $ZodSymbol instance.
 *
 * The `$ZodSymbol` export is a constructor created by `core.$constructor`.
 * It expects a definition object that matches `$ZodSymbolDef`.
 * For the purpose of these tests we only need to provide `{ type: "symbol" }`.
 */
function getZodSymbolInstance() {
  // The constructor returns an object that contains the internal `_zod` namespace.
  // Using `as any` sidesteps the lack of concrete typings in this isolated test.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const instance = ($ZodSymbol as any)({ type: "symbol" });
  return instance as {
    _zod: {
      parse: (payload: ReturnType<typeof createPayload<any>>, ctx: unknown) => typeof payload;
    };
  };
}

/* -------------------------------------------------------------------------- */
/*  Test Cases (one per expert)                                               */
/* -------------------------------------------------------------------------- */

describe("$ZodSymbol parsing", () => {
  const schema = getZodSymbolInstance();

  /* ---------------------------------------------------------------------- */
  /*  Expert 1 – Successful validation with a plain Symbol                  */
  /* ---------------------------------------------------------------------- */
  it("accepts a plain Symbol and leaves payload untouched", () => {
    const sym = Symbol("test");
    const payload = createPayload(sym);

    const result = schema._zod.parse(payload, undefined);

    // The parser should return the exact same payload object.
    expect(result).toBe(payload);
    // No issues should have been added.
    expect(payload.issues).toHaveLength(0);
    // The value should remain unchanged.
    expect(payload.value).toBe(sym);
  });

  /* ---------------------------------------------------------------------- */
  /*  Expert 2 – Successful validation with well‑known symbols (Symbol.iterator, Symbol.for) */
  /* ---------------------------------------------------------------------- */
  it("accepts well‑known symbols (Symbol.iterator, Symbol.for) without issues", () => {
    const wellKnown = [Symbol.iterator, Symbol.for("global")];
    for (const wk of wellKnown) {
      const payload = createPayload(wk);
      const result = schema._zod.parse(payload, undefined);
      expect(result).toBe(payload);
      expect(payload.issues).toHaveLength(0);
      expect(payload.value).toBe(wk);
    }
  });

  /* ---------------------------------------------------------------------- */
  /*  Expert 3 – Failure when value is not a symbol (string, number, object) */
  /* ---------------------------------------------------------------------- */
  it("rejects non‑symbol values and records a proper issue", () => {
    const nonSymbols = [
      "string",
      123,
      true,
      null,
      undefined,
      {},
      [],
      () => Symbol("fn"),
    ];

    for (const val of nonSymbols) {
      const payload = createPayload(val);
      const result = schema._zod.parse(payload, undefined);

      // The parser returns the same payload (mutated in‑place).
      expect(result).toBe(payload);
      // Exactly one issue should be recorded.
      expect(payload.issues).toHaveLength(1);
      const issue = payload.issues[0];

      // Issue shape verification.
      expect(issue).toMatchObject({
        expected: "symbol",
        code: "invalid_type",
        input: val,
        // `inst` should be the schema instance itself.
        // Using `toBe` ensures reference equality.
        // We cannot guarantee the exact type, but we can assert it is the same object.
      });
      expect(issue.inst).toBe(schema);
    }
  });

  /* ---------------------------------------------------------------------- */
  /*  Additional Edge Cases – Missing `value` property, `value` is undefined */
  /* ---------------------------------------------------------------------- */
  it("handles payloads missing the `value` property gracefully (treated as undefined)", () => {
    // @ts-ignore – intentionally creating a malformed payload.
    const payload = { issues: [] };
    // The parser accesses `payload.value`; undefined is not a symbol.
    const result = schema._zod.parse(payload as any, undefined);
    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue.expected).toBe("symbol");
    expect(issue.code).toBe("invalid_type");
    expect(issue.input).toBeUndefined();
    expect(issue.inst).toBe(schema);
  });

  it("rejects explicit undefined value", () => {
    const payload = createPayload(undefined);
    const result = schema._zod.parse(payload, undefined);
    expect(result).toBe(payload);
    expect(payload.issues).toHaveLength(1);
    const issue = payload.issues[0];
    expect(issue.input).toBeUndefined();
  });
});
```
###Test END##