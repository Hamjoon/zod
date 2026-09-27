**$ZodSymbol.test.ts**

```ts
###Test START##
import { describe, it, expect } from "vitest";
import { $ZodSymbol } from "./schemas.js";
import { ZodError } from "zod";

/**
 * Public API of $ZodSymbol (inherited from $ZodType)
 * -------------------------------------------------
 *  - parse(value: any): any
 *  - safeParse(value: any): { success: true; data: any } | { success: false; error: ZodError }
 *  - refine(...), optional(), nullable(), etc. (inherited – not exercised here)
 *
 * For the purpose of these tests we focus on the two core parsing methods:
 *   • parse – throws on invalid input
 *   • safeParse – returns a result object with success flag and error details
 */

describe("$ZodSymbol – basic functionality", () => {
  const schema = $ZodSymbol();

  it("should accept a plain Symbol and return it unchanged", () => {
    const sym = Symbol("plain");
    const result = schema.parse(sym);
    expect(result).toBe(sym);
  });

  it("should accept a global Symbol (Symbol.for) and return it unchanged", () => {
    const globalSym = Symbol.for("global-key");
    const result = schema.parse(globalSym);
    expect(result).toBe(globalSym);
  });

  it("should accept built‑in well‑known symbols (e.g., Symbol.iterator)", () => {
    const iteratorSym = Symbol.iterator;
    const result = schema.parse(iteratorSym);
    expect(result).toBe(iteratorSym);
  });

  it("should accept a Symbol without description", () => {
    const noDescSym = Symbol();
    const result = schema.parse(noDescSym);
    expect(result).toBe(noDescSym);
  });
});

describe("$ZodSymbol – error handling (parse)", () => {
  const schema = $ZodSymbol();

  const invalidValues = [
    { value: 42, name: "number" },
    { value: "string", name: "string" },
    { value: true, name: "boolean" },
    { value: null, name: "null" },
    { value: undefined, name: "undefined" },
    { value: {}, name: "object" },
    { value: [], name: "array" },
    { value: () => {}, name: "function" },
  ];

  for (const { value, name } of invalidValues) {
    it(`should throw ZodError when parsing a ${name}`, () => {
      expect(() => schema.parse(value)).toThrowError(ZodError);
      try {
        schema.parse(value);
      } catch (e) {
        if (e instanceof ZodError) {
          const issue = e.issues[0];
          expect(issue.code).toBe("invalid_type");
          expect(issue.expected).toBe("symbol");
          expect(issue.input).toBe(value);
          expect(issue.inst).toBe(schema);
        } else {
          throw e; // re‑throw unexpected errors
        }
      }
    });
  }
});

describe("$ZodSymbol – safeParse edge cases", () => {
  const schema = $ZodSymbol();

  it("returns success:true for a valid Symbol", () => {
    const sym = Symbol("valid");
    const result = schema.safeParse(sym);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(sym);
    }
  });

  it("returns success:false with proper issue for an invalid value", () => {
    const result = schema.safeParse(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      const { error } = result;
      expect(error).toBeInstanceOf(ZodError);
      const issue = error.issues[0];
      expect(issue.code).toBe("invalid_type");
      expect(issue.expected).toBe("symbol");
      expect(issue.input).toBe(123);
      expect(issue.inst).toBe(schema);
    }
  });

  it("handles undefined gracefully (should be an error)", () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.code).toBe("invalid_type");
      expect(issue.expected).toBe("symbol");
      expect(issue.input).toBe(undefined);
    }
  });
});
###Test END##
```